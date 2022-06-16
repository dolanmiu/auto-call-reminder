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

const redirectUnauthorizedToLogin = (
  _: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => redirectUnauthorizedTo(`login?redirectUrl=${state.url}`);

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
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
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        resolve: { user: AuthResolver },
      },
      {
        path: 'call-configs',
        loadChildren: () =>
          import(`./call-configs/call-configs.module`).then(
            (m) => m.CallConfigsModule
          ),
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        resolve: { user: AuthResolver },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingRoutingModule {}
