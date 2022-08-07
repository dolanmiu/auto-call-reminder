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
import { HttpClient } from '@angular/common/http';
import { addDoc } from 'firebase/firestore';

import { CallConfig, Call } from '@models';
import {
  filterNullish,
  getCallCollectionReference,
  getCallConfigDocumentReference,
  isNotTimeCron,
  isValidCron,
  notIdenticalTo,
} from '@common';

interface CallConfigForm {
  cron: FormControl<string>;
  toNumber: FormControl<string>;
}

@Component({
  selector: 'app-call-config',
  templateUrl: './call-config.component.html',
  styleUrls: ['./call-config.component.scss'],
})
export class CallConfigComponent {
  public readonly calls$: Observable<QueryDocumentSnapshot<Call<Timestamp>>[]>;
  public readonly callConfig$: Observable<CallConfig>;
  public makingCall = false;
  private readonly callCollectionReference: CollectionReference<
    Call<Timestamp>
  >;
  private readonly callConfigDocumentReference: DocumentReference<CallConfig>;
  public readonly callConfigUid: string;
  public readonly user: User;
  public readonly updateCallConfigForm: FormGroup<CallConfigForm>;
  public readonly cron$: Observable<string>;

  constructor(
    route: ActivatedRoute,
    firestore: Firestore,
    private readonly http: HttpClient
  ) {
    this.callConfigUid = route.parent?.snapshot.paramMap.get(
      'callConfigUid'
    ) as string;
    this.user = route.snapshot.data['user'] as User;

    this.callConfigDocumentReference = getCallConfigDocumentReference(
      firestore,
      this.user.uid,
      this.callConfigUid
    );

    this.callConfig$ = docData(this.callConfigDocumentReference);

    this.callCollectionReference = getCallCollectionReference(
      firestore,
      this.user.uid,
      this.callConfigUid
    );

    this.calls$ = collectionSnapshots(this.callCollectionReference).pipe(
      map((calls) => calls.filter((c) => c.data().status !== 'dummy')),
      map((calls) =>
        [...calls].sort(
          (a, b) =>
            b.data().createdAt.toDate().getTime() -
            a.data().createdAt.toDate().getTime()
        )
      )
    );

    this.updateCallConfigForm = new FormGroup<CallConfigForm>({
      cron: new FormControl('', {
        validators: Validators.compose([
          Validators.required,
          notIdenticalTo('* * * * ? *'),
          isValidCron(),
          isNotTimeCron(),
        ]),
        nonNullable: true,
      }),
      toNumber: new FormControl('', {
        validators: Validators.required,
        nonNullable: true,
      }),
    });

    this.cron$ = this.updateCallConfigForm.valueChanges.pipe(
      map((f) => f.cron),
      filterNullish()
    );

    this.callConfig$.pipe(take(1)).subscribe((config) => {
      this.updateCallConfigForm.setValue({
        cron: config.cron,
        toNumber: config.toNumber,
      });
    });
  }

  public testCall(): void {
    this.makingCall = true;
    this.http
      .get(
        `https://europe-west2-phone-scheduler.cloudfunctions.net/testCall?callConfigUid=${this.callConfigUid}&userUid=${this.user.uid}`
      )
      .pipe(take(1))
      .subscribe();

    setTimeout(() => {
      this.makingCall = false;
    }, 20000);
  }

  public cancelCall(callUid: string): void {
    this.http
      .get(
        `https://europe-west2-phone-scheduler.cloudfunctions.net/cancelCall?callUid=${callUid}`
      )
      .pipe(take(1))
      .subscribe();
  }

  public async updateCallConfig(): Promise<void> {
    if (!this.updateCallConfigForm.valid) {
      return;
    }

    await updateDoc(this.callConfigDocumentReference, {
      cron: this.updateCallConfigForm.value.cron,
      toNumber: this.updateCallConfigForm.value.toNumber,
    });
  }

  public async toggle(): Promise<void> {
    this.callConfig$.pipe(take(1)).subscribe(async (config) => {
      await updateDoc(this.callConfigDocumentReference, {
        enabled: !config.enabled,
      });
      await addDoc(this.callCollectionReference, {
        createdAt: Timestamp.now(),
        status: 'dummy',
      });
    });
  }
}
