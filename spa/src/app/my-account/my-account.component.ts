import { Component } from '@angular/core';
import {
  Firestore,
  docData,
  DocumentReference,
  updateDoc,
} from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from 'firebase/auth';
import { take } from 'rxjs';

import { AuthService } from '@shared';
import { getUserDocumentReference } from '@common';
import { UserData } from '@models';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss'],
})
export class MyAccountComponent {
  public readonly accountForm: FormGroup;
  private readonly docReference: DocumentReference<UserData>;

  public constructor(
    private readonly authService: AuthService,
    fb: FormBuilder,
    firestore: Firestore,
    route: ActivatedRoute
  ) {
    const user = route.snapshot.data['user'] as User;

    this.accountForm = fb.group({
      displayName: ['', Validators.required],
      phoneNumber: [''],
    });

    this.docReference = getUserDocumentReference(firestore, user.uid);

    docData(getUserDocumentReference(firestore, user.uid))
      .pipe(take(1))
      .subscribe((v) => {
        this.accountForm.setValue(v);
      });
  }

  public signOut(): void {
    this.authService.signOut();
  }

  public async changeDetails(): Promise<void> {
    if (!this.accountForm.valid) {
      return;
    }

    await updateDoc(this.docReference, this.accountForm.value);
  }
}
