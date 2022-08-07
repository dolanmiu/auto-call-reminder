import { Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  GuardsCheckEnd,
  GuardsCheckStart,
  NavigationCancel,
  Router,
} from '@angular/router';

import { GlobalMessengerService } from '@shared';
import { Observable } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public loading = false;
  public guardType: string | undefined = undefined;
  public message$: Observable<string>;

  public constructor(router: Router, messenger: GlobalMessengerService) {
    this.message$ = messenger.message$;

    // https://stackoverflow.com/questions/48486623/show-loading-indicator-during-canactivate
    router.events.pipe(untilDestroyed(this)).subscribe((event) => {
      if (event instanceof GuardsCheckStart) {
        if (event.urlAfterRedirects === '/whatsapp/dashboard') {
          this.guardType = 'whatsapp';
        } else {
          this.guardType = undefined;
        }
        console.log(event);
        this.loading = true;
        console.log('GuardStart');
      }
      if (
        event instanceof GuardsCheckEnd ||
        event instanceof NavigationCancel
      ) {
        this.loading = false;
        console.log('GuardEnd');
      }
    });
  }
}
