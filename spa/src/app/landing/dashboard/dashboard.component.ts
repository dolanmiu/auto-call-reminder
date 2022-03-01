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

import { getCallConfigCollectionReference, notIdenticalTo } from '@common';
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

  constructor(firestore: Firestore, route: ActivatedRoute, fb: FormBuilder) {
    const user = route.snapshot.data['user'] as User;

    this.callConfigCollectionReference = getCallConfigCollectionReference(
      firestore,
      user.uid
    );

    this.callConfigs$ = collectionSnapshots(this.callConfigCollectionReference);

    this.createCallConfigForm = fb.group({
      cron: [
        '',
        Validators.compose([
          Validators.required,
          notIdenticalTo('* * * * ? *'),
        ]),
      ],
      toNumber: ['', Validators.required],
    });

    this.cron$ = this.createCallConfigForm.valueChanges.pipe(
      map((f) => f.cron)
    );
  }

  public createCallConfig(): void {
    if (!this.createCallConfigForm.valid) {
      return;
    }

    addDoc(this.callConfigCollectionReference, {
      cron: this.createCallConfigForm.value.cron,
      toNumber: this.createCallConfigForm.value.toNumber,
      soundFile: '',
    });
  }

  public async deleteCallConfig(
    snapshot: QueryDocumentSnapshot<CallConfig>
  ): Promise<void> {
    await deleteDoc(doc(this.callConfigCollectionReference, snapshot.id));
  }
}
