import { Component } from '@angular/core';
import {
  CollectionReference,
  Firestore,
  collectionData,
  addDoc,
} from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from 'firebase/auth';
import { map, Observable } from 'rxjs';

import { getCallConfigCollectionReference, notIdenticalTo } from '@common';
import { CallConfig } from '@models';

const getCronString = require('@darkeyedevelopers/natural-cron.js');

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  public readonly callConfigs$: Observable<CallConfig[]>;
  public readonly createCallConfigForm: FormGroup;
  public readonly cron$: Observable<string>;
  private readonly callConfigCollectionReference: CollectionReference<CallConfig>;

  constructor(firestore: Firestore, route: ActivatedRoute, fb: FormBuilder) {
    const user = route.snapshot.data['user'] as User;

    this.callConfigCollectionReference = getCallConfigCollectionReference(
      firestore,
      user.uid
    );

    this.callConfigs$ = collectionData(this.callConfigCollectionReference);

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
      map((f) => f.cron),
      map((c) => getCronString(c))
    );
  }

  public createCallConfig(): void {
    if (!this.createCallConfigForm.valid) {
      return;
    }

    console.log('working');

    return;

    addDoc(this.callConfigCollectionReference, {
      cron: this.createCallConfigForm.value.cron,
      toNumber: this.createCallConfigForm.value.toNumber,
    });
  }
}
