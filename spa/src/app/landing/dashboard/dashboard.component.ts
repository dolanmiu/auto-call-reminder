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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from '@angular/fire/auth';
import { map, Observable } from 'rxjs';
import { Timestamp } from 'firebase/firestore';

import {
  getCallCollectionReference,
  getCallConfigCollectionReference,
  notIdenticalTo,
  isValidCron,
  isNotTimeCron,
} from '@common';
import { CallConfig } from '@models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  public readonly callConfigs$: Observable<QueryDocumentSnapshot<CallConfig>[]>;
  public readonly createCallConfigForm: FormGroup;
  public readonly cron$: Observable<string>;
  private readonly callConfigCollectionReference: CollectionReference<CallConfig>;
  private readonly user: User;

  constructor(
    private readonly firestore: Firestore,
    route: ActivatedRoute,
    fb: FormBuilder
  ) {
    this.user = route.snapshot.data['user'] as User;

    this.callConfigCollectionReference = getCallConfigCollectionReference(
      firestore,
      this.user.uid
    );

    this.callConfigs$ = collectionSnapshots(this.callConfigCollectionReference);

    this.createCallConfigForm = fb.group({
      cron: [
        '',
        Validators.compose([
          Validators.required,
          notIdenticalTo('* * * * ? *'),
          isValidCron(),
          isNotTimeCron(),
        ]),
      ],
      toNumber: ['', Validators.required],
    });

    this.cron$ = this.createCallConfigForm.valueChanges.pipe(
      map((f) => f.cron)
    );
  }

  public async createCallConfig(): Promise<void> {
    if (!this.createCallConfigForm.valid) {
      return;
    }

    const doc = await addDoc(this.callConfigCollectionReference, {
      cron: this.createCallConfigForm.value.cron,
      toNumber: this.createCallConfigForm.value.toNumber,
      soundFile: 'http://demo.twilio.com/docs/classic.mp3',
      enabled: true,
    });

    const callsCollectionReference = getCallCollectionReference(
      this.firestore,
      this.user.uid,
      doc.id
    );

    // Note: Dummy call is needed for the cron job.
    // If there is no dummy call, the cron will activate immediately because it would assume a call needs to be placed
    addDoc(callsCollectionReference, {
      createdAt: Timestamp.now(),
      status: 'dummy',
    });
  }

  public async deleteCallConfig(
    snapshot: QueryDocumentSnapshot<CallConfig>
  ): Promise<void> {
    await deleteDoc(doc(this.callConfigCollectionReference, snapshot.id));
  }
}
