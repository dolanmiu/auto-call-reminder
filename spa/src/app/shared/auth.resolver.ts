import { Auth, User, user } from '@angular/fire/auth';
import { filter, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resolve } from '@angular/router';

import { notEmpty } from '@util';

@Injectable({
  providedIn: 'root',
})
export class AuthResolver implements Resolve<User> {
  public constructor(private readonly afAuth: Auth) {}
  public resolve(): Observable<User> {
    return user(this.afAuth).pipe(filter(notEmpty), take(1));
  }
}
