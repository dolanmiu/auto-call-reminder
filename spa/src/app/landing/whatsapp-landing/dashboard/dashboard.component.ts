import { Component } from '@angular/core';
import {
  CollectionReference,
  Firestore,
  QueryDocumentSnapshot,
  addDoc,
  collectionSnapshots,
  doc,
  deleteDoc,
} from '@angular/fire/firestore';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from '@angular/fire/auth';
import { map, Observable } from 'rxjs';
import { Timestamp } from 'firebase/firestore';

import {
  getCallCollectionReference,
  notIdenticalTo,
  isValidCron,
  isNotTimeCron,
  getUserFromRouteData,
  getWhatsAppConfigCollectionReference,
  filterNullish,
  getWhatsAppMessageCollectionReference,
} from '@common';
import { WhatsAppChat, WhatsAppConfig } from '@models';
import { WhatsappAuthService } from '../whatsapp-auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  public readonly whatsAppConfigs$: Observable<
    QueryDocumentSnapshot<WhatsAppConfig>[]
  >;
  public readonly createConfigForm: FormGroup<{
    cron: FormControl<string>;
    to: FormControl<string>;
  }>;
  public readonly cron$: Observable<string>;
  public readonly chats$: Observable<WhatsAppChat[]>;
  private readonly whatsAppConfigCollectionReference: CollectionReference<WhatsAppConfig>;
  private readonly user: User;

  constructor(
    private readonly firestore: Firestore,
    route: ActivatedRoute,
    fb: FormBuilder,
    whatsappService: WhatsappAuthService
  ) {
    this.user = getUserFromRouteData(route);

    this.whatsAppConfigCollectionReference =
      getWhatsAppConfigCollectionReference(firestore, this.user.uid);

    this.whatsAppConfigs$ = collectionSnapshots(
      this.whatsAppConfigCollectionReference
    );

    this.createConfigForm = fb.nonNullable.group({
      cron: fb.nonNullable.control(
        '',
        Validators.compose([
          Validators.required,
          notIdenticalTo('* * * * ? *'),
          isValidCron(),
          isNotTimeCron(),
        ])
      ),
      to: fb.nonNullable.control('', Validators.required),
    });

    this.cron$ = this.createConfigForm.valueChanges.pipe(
      map((f) => f.cron),
      filterNullish()
    );

    this.chats$ = whatsappService.chats$;
  }

  public async createConfig(): Promise<void> {
    if (!this.createConfigForm.valid) {
      return;
    }

    if (!this.createConfigForm.value.cron || !this.createConfigForm.value.to) {
      return;
    }

    const doc = await addDoc(this.whatsAppConfigCollectionReference, {
      cron: this.createConfigForm.value.cron,
      to: this.createConfigForm.value.to,
      gpt3Prompt: '',
      message: '',
      enabled: true,
    });

    const whatsAppMessageCollectionReference =
      getWhatsAppMessageCollectionReference(
        this.firestore,
        this.user.uid,
        doc.id
      );

    // Note: Dummy call is needed for the cron job.
    // If there is no dummy call, the cron will activate immediately because it would assume a call needs to be placed
    addDoc(whatsAppMessageCollectionReference, {
      createdAt: Timestamp.now(),
      status: 'dummy',
      content: '',
    });
  }

  public async deleteConfig(
    snapshot: QueryDocumentSnapshot<WhatsAppConfig>
  ): Promise<void> {
    await deleteDoc(doc(this.whatsAppConfigCollectionReference, snapshot.id));
  }
}
