import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, tap } from 'rxjs';

import { GlobalMessengerService } from '@shared';

import { WhatsappAuthService } from './whatsapp-auth.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Injectable()
export class WhatsappAuthGuard implements CanActivate {
  public constructor(
    private readonly whatsAppAuth: WhatsappAuthService,
    private readonly afAuth: Auth,
    private readonly router: Router,
    private readonly globalMessenger: GlobalMessengerService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const user = this.afAuth.currentUser;

    if (!user) {
      console.error('No user');
      return false;
    }

    this.whatsAppAuth.connectToWhatsApp(user);
    this.whatsAppAuth.message$
      .pipe(
        untilDestroyed(this),
        tap((c) => this.globalMessenger.sendMessage(c))
      )
      .subscribe();

    return this.whatsAppAuth.isAuthenticated$.pipe(
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigate(['/whatsapp/linking']);
        }
      })
    );
  }
}
