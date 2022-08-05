import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, tap } from 'rxjs';
import { WhatsappAuthService } from './whatsapp-auth.service';

@Injectable()
export class WhatsappAuthGuard implements CanActivate {
  public constructor(
    private readonly whatsAppAuth: WhatsappAuthService,
    private readonly afAuth: Auth,
    private readonly router: Router
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
    return this.whatsAppAuth.isAuthenticated$.pipe(
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigate(['/whatsapp/linking']);
        }
      })
    );
  }
}
