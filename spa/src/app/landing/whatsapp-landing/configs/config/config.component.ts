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
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '@angular/fire/auth';
import { addDoc } from 'firebase/firestore';

import { WhatsAppChat, WhatsAppConfig, WhatsAppMessage } from '@models';
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

interface ConfigForm {
  cron: FormControl<string>;
  to: FormControl<string>;
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

  constructor(route: ActivatedRoute, firestore: Firestore) {
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

    this.updateConfigForm = new FormGroup<ConfigForm>({
      cron: new FormControl('', {
        validators: Validators.compose([
          Validators.required,
          notIdenticalTo('* * * * ? *'),
          isValidCron(),
          isNotTimeCron(),
        ]),
        nonNullable: true,
      }),
      to: new FormControl('', {
        validators: Validators.required,
        nonNullable: true,
      }),
    });

    this.cron$ = this.updateConfigForm.valueChanges.pipe(
      map((f) => f.cron),
      filterNullish()
    );

    this.whatsAppConfig$.pipe(take(1)).subscribe((config) => {
      this.updateConfigForm.setValue({
        cron: config.cron,
        to: config.to,
      });
    });
  }

  public async updateConfig(): Promise<void> {
    if (!this.updateConfigForm.valid) {
      return;
    }

    await updateDoc(this.whatsAppConfigDocumentReference, {
      cron: this.updateConfigForm.value.cron,
      to: this.updateConfigForm.value.to,
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
}
