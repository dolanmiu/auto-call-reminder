import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CollectionReference,
  Firestore,
  collectionData,
  collectionSnapshots,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from '@angular/fire/auth';
import { Timestamp } from 'firebase/firestore';

import { CallConfig, Call } from '@models';
import {
  getCallCollectionReference,
  getCallConfigDocumentReference,
} from '@common';
import { docData } from 'rxfire/firestore';

@Component({
  selector: 'app-call-config',
  templateUrl: './call-config.component.html',
  styleUrls: ['./call-config.component.scss'],
})
export class CallConfigComponent {
  public readonly calls$: Observable<Call<Timestamp>[]>;
  public readonly callConfig$: Observable<CallConfig>;
  public readonly createAudioForm: FormGroup;
  private readonly callCollectionReference: CollectionReference<
    Call<Timestamp>
  >;

  constructor(route: ActivatedRoute, firestore: Firestore, fb: FormBuilder) {
    const callConfigUid = route.parent?.snapshot.paramMap.get(
      'callConfigUid'
    ) as string;
    const user = route.snapshot.data['user'] as User;

    this.callConfig$ = docData(
      getCallConfigDocumentReference(firestore, user.uid, callConfigUid)
    );

    this.callCollectionReference = getCallCollectionReference(
      firestore,
      user.uid,
      callConfigUid
    );

    this.calls$ = collectionData(this.callCollectionReference);
    this.createAudioForm = fb.group({
      audio: [''],
    });
  }
}
