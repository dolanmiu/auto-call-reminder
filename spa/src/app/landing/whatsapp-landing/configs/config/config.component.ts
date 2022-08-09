import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CollectionReference,
  Firestore,
  docData,
  collectionSnapshots,
  QueryDocumentSnapshot,
  DocumentReference,
  Timestamp,
  updateDoc,
} from '@angular/fire/firestore';
import { map, Observable, take } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { User } from '@angular/fire/auth';
import { addDoc } from 'firebase/firestore';

import {
  Gpt3PromptRequest,
  WhatsAppChat,
  WhatsAppConfig,
  WhatsAppMessage,
  WhatsAppMessageRequest,
} from '@models';
import {
  filterNullish,
  getChatsFromRoute,
  getUserFromRouteData,
  getWhatsAppConfigDocumentReference,
  getWhatsAppMessageCollectionReference,
  isNotTimeCron,
  isValidCron,
  notIdenticalTo,
} from '@common';
import {
  Functions,
  HttpsCallable,
  httpsCallable,
} from '@angular/fire/functions';

interface ConfigForm {
  cron: FormControl<string>;
  to: FormControl<string>;
  gpt3Prompt: FormControl<string>;
  message: FormControl<string>;
  count: FormControl<number>;
}

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
})
export class ConfigComponent {
  public readonly whatsAppMessages$: Observable<
    QueryDocumentSnapshot<WhatsAppMessage<Timestamp>>[]
  >;
  public readonly whatsAppConfig$: Observable<WhatsAppConfig>;
  public makingCall = false;
  private readonly whatsAppMessageCollectionReference: CollectionReference<
    WhatsAppMessage<Timestamp>
  >;
  private readonly whatsAppConfigDocumentReference: DocumentReference<WhatsAppConfig>;
  public readonly whatsAppConfigUid: string;
  public readonly user: User;
  public readonly updateConfigForm: FormGroup<ConfigForm>;
  public readonly cron$: Observable<string>;
  public readonly chats: WhatsAppChat[];
  public readonly gp3Prompt: HttpsCallable<Gpt3PromptRequest, string[]>;
  public readonly sendMessage: HttpsCallable<WhatsAppMessageRequest, void>;

  public completions: string[] = [];

  constructor(
    route: ActivatedRoute,
    firestore: Firestore,
    fns: Functions,
    fb: FormBuilder
  ) {
    this.chats = getChatsFromRoute(route);

    this.whatsAppConfigUid = route.parent?.snapshot.paramMap.get(
      'configUid'
    ) as string;
    this.user = getUserFromRouteData(route);

    this.whatsAppConfigDocumentReference = getWhatsAppConfigDocumentReference(
      firestore,
      this.user.uid,
      this.whatsAppConfigUid
    );

    this.whatsAppConfig$ = docData(this.whatsAppConfigDocumentReference);

    this.whatsAppMessageCollectionReference =
      getWhatsAppMessageCollectionReference(
        firestore,
        this.user.uid,
        this.whatsAppConfigUid
      );

    this.whatsAppMessages$ = collectionSnapshots(
      this.whatsAppMessageCollectionReference
    ).pipe(
      map((calls) => calls.filter((c) => c.data().status !== 'dummy')),
      map((calls) =>
        [...calls].sort(
          (a, b) =>
            b.data().createdAt.toDate().getTime() -
            a.data().createdAt.toDate().getTime()
        )
      )
    );

    this.updateConfigForm = fb.nonNullable.group({
      cron: fb.nonNullable.control('', {
        validators: Validators.compose([
          Validators.required,
          notIdenticalTo('* * * * ? *'),
          isValidCron(),
          isNotTimeCron(),
        ]),
      }),
      to: fb.nonNullable.control('', {
        validators: Validators.required,
      }),
      gpt3Prompt: fb.nonNullable.control(''),
      message: fb.nonNullable.control(''),
      count: fb.nonNullable.control(0),
    });

    this.cron$ = this.updateConfigForm.valueChanges.pipe(
      map((f) => f.cron),
      filterNullish()
    );

    this.whatsAppConfig$.pipe(take(1)).subscribe((config) => {
      this.updateConfigForm.setValue({
        cron: config.cron,
        to: config.to,
        gpt3Prompt: config.gpt3Prompt,
        message: config.message,
        count: config.count,
      });
    });

    this.gp3Prompt = httpsCallable<Gpt3PromptRequest, string[]>(
      fns,
      'gpt3Prompt'
    );

    this.sendMessage = httpsCallable<WhatsAppMessageRequest, void>(
      fns,
      'sendWhatsAppMessage'
    );
  }

  public async updateConfig(): Promise<void> {
    console.log(this.updateConfigForm.valid, this.updateConfigForm.errors);
    if (!this.updateConfigForm.valid) {
      return;
    }

    await updateDoc(this.whatsAppConfigDocumentReference, {
      cron: this.updateConfigForm.value.cron,
      to: this.updateConfigForm.value.to,
      gpt3Prompt: this.updateConfigForm.value.gpt3Prompt,
      message: this.updateConfigForm.value.message,
    });
  }

  public async toggle(): Promise<void> {
    this.whatsAppConfig$.pipe(take(1)).subscribe(async (config) => {
      await updateDoc(this.whatsAppConfigDocumentReference, {
        enabled: !config.enabled,
      });
      await addDoc(this.whatsAppMessageCollectionReference, {
        createdAt: Timestamp.now(),
        status: 'dummy',
        content: '',
      });
    });
  }

  public async createCompletions(): Promise<void> {
    if (!this.updateConfigForm.value.gpt3Prompt) {
      return;
    }

    const output = await this.gp3Prompt({
      prompt: this.updateConfigForm.value.gpt3Prompt,
    });

    this.completions = output.data;
  }

  public async testMessage(): Promise<void> {
    if (
      !this.updateConfigForm.value.to ||
      !this.updateConfigForm.value.message ||
      !this.updateConfigForm.value.gpt3Prompt
    ) {
      return;
    }

    this.makingCall = true;

    await this.sendMessage({
      userUid: this.user.uid,
      chatId: this.updateConfigForm.value.to,
      message: this.updateConfigForm.value.message,
      gpt3Prompt: this.updateConfigForm.value.gpt3Prompt,
      configUid: this.whatsAppConfigUid,
    });

    setTimeout(() => {
      this.makingCall = false;
    }, 20000);
  }
}
