import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { WhatsappAuthService } from '../whatsapp-auth.service';
import { Router } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-linking',
  templateUrl: './linking.component.html',
  styleUrls: ['./linking.component.scss'],
})
export class LinkingComponent {
  public readonly qrCode$: Observable<string>;

  constructor(whatsappAuthService: WhatsappAuthService, router: Router) {
    this.qrCode$ = whatsappAuthService.qrCode$;
    whatsappAuthService.isAuthenticated$
      .pipe(
        untilDestroyed(this),
        tap((e) => {
          if (e) {
            router.navigate(['../dashboard']);
          }
        })
      )
      .subscribe();
  }
}
