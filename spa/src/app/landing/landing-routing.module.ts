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
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import(`./dashboard/dashboard.module`).then((m) => m.DashboardModule),
        data: { authGuardPipe: redirectUnauthorizedToLogin },
      },
      {
        path: 'call-configs',
        loadChildren: () =>
          import(`./call-configs/call-configs.module`).then(
            (m) => m.CallConfigsModule
          ),
        data: { authGuardPipe: redirectUnauthorizedToLogin },
      },
      {
        path: 'whatsapp',
        loadChildren: () =>
          import(`./whatsapp-landing/whatsapp-landing.module`).then(
            (m) => m.WhatsappLandingModule
          ),
        data: { authGuardPipe: redirectUnauthorizedToLogin },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingRoutingModule {}
