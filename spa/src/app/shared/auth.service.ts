import {
  Auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  user,
} from '@angular/fire/auth';
import { Firestore, docData } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { UserData } from '@models';
import { getUserDocumentReference } from '@common';

import { isInStandaloneMode } from './pwa-util';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public readonly user$: Observable<UserData | undefined | null>;

  public constructor(
    private readonly firestore: Firestore,
    private readonly afAuth: Auth,
    private readonly router: Router
  ) {
    this.user$ = user(afAuth).pipe(
      switchMap((u) => {
        // Logged in
        if (u) {
          return docData(getUserDocumentReference(this.firestore, u.uid));
        } else {
          // Logged out
          return of(null);
        }
      })
    );
  }

  public async googleSignin(redirectUrl: string = '/'): Promise<void> {
    const provider = new GoogleAuthProvider();

    const authResponse = isInStandaloneMode()
      ? await signInWithRedirect(this.afAuth, provider)
      : await signInWithPopup(this.afAuth, provider);

    if (!authResponse || !authResponse.user) {
      return;
    }
    this.router.navigate([redirectUrl]);

    // return this.updateUserData(credential.user);
  }

  public async emailSignin(
    email: string,
    password: string,
    redirectUrl: string = '/'
  ): Promise<void> {
    await signInWithEmailAndPassword(this.afAuth, email, password);

    this.router.navigate([redirectUrl]);
  }

  public async signOut(): Promise<void> {
    await this.afAuth.signOut();
    this.router.navigate(['../login']);
  }
}
