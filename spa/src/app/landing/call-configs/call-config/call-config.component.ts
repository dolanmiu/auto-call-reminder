import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CollectionReference,
  Firestore,
  collectionData,
  docData,
} from '@angular/fire/firestore';
import { map, Observable, take } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from '@angular/fire/auth';
import { Timestamp } from 'firebase/firestore';
import { HttpClient } from '@angular/common/http';

import { CallConfig, Call } from '@models';
import {
  getCallCollectionReference,
  getCallConfigDocumentReference,
} from '@common';

@Component({
  selector: 'app-call-config',
  templateUrl: './call-config.component.html',
  styleUrls: ['./call-config.component.scss'],
})
export class CallConfigComponent {
  public readonly calls$: Observable<Call<Timestamp>[]>;
  public readonly callConfig$: Observable<CallConfig>;
  public readonly createAudioForm: FormGroup;
  public makingCall = false;
  private readonly callCollectionReference: CollectionReference<
    Call<Timestamp>
  >;
  public readonly callConfigUid: string;
  public readonly user: User;

  constructor(
    route: ActivatedRoute,
    firestore: Firestore,
    fb: FormBuilder,
    private readonly http: HttpClient
  ) {
    this.callConfigUid = route.parent?.snapshot.paramMap.get(
      'callConfigUid'
    ) as string;
    this.user = route.snapshot.data['user'] as User;

    this.callConfig$ = docData(
      getCallConfigDocumentReference(
        firestore,
        this.user.uid,
        this.callConfigUid
      )
    );

    this.callCollectionReference = getCallCollectionReference(
      firestore,
      this.user.uid,
      this.callConfigUid
    );

    this.calls$ = collectionData(this.callCollectionReference).pipe(
      map((calls) => calls.filter((c) => c.status !== 'dummy')),
      map((calls) =>
        [...calls].sort(
          (a, b) =>
            b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime()
        )
      )
    );
    this.createAudioForm = fb.group({
      audio: [''],
    });
  }

  public testCall(): void {
    this.makingCall = true;
    this.http
      .get(
        `https://europe-west2-phone-scheduler.cloudfunctions.net/testCall?callConfigUid=${this.callConfigUid}&userUid=${this.user.uid}`
      )
      .pipe(take(1))
      .subscribe(() => {
        this.makingCall = false;
      });
  }
}
