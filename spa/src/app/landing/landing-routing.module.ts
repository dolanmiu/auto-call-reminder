import { NgModule } from '@angular/core';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import {
  ActivatedRouteSnapshot,
  RouterModule,
  RouterStateSnapshot,
  Routes,
} from '@angular/router';

import { AuthResolver } from '@shared';

import { LandingComponent } from './landing.component';

export const redirectUnauthorizedToLogin = (
  _: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => redirectUnauthorizedTo(`login?redirectUrl=${state.url}`);

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    canActivate: [AuthGuard],
    resolve: { user: AuthResolver },
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    children: [
      {
        path: '',
        redirectTo: 'call',
        pathMatch: 'full',
      },
      {
        path: 'call',
        loadChildren: () =>
          import(`./call-landing/call-landing.module`).then(
            (m) => m.CallLandingModule
          ),
      },
      {
        path: 'whatsapp',
        loadChildren: () =>
          import(`./whatsapp-landing/whatsapp-landing.module`).then(
            (m) => m.WhatsappLandingModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingRoutingModule {}
