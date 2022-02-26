import { NgModule } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterModule,
  RouterStateSnapshot,
  Routes,
} from '@angular/router';
import {
  AuthGuard,
  AuthGuardModule,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';

import { AuthResolver } from '@shared';

const redirectUnauthorizedToLogin = (
  _: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => redirectUnauthorizedTo(`login?redirectUrl=${state.url}`);
const redirectLoggedInToHome = () => redirectLoggedInTo(['']);

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import(`./landing/landing.module`).then((m) => m.LandingModule),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    resolve: { user: AuthResolver },
  },
  {
    path: 'login',
    loadChildren: () =>
      import(`./login/login.module`).then((m) => m.LoginModule),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectLoggedInToHome },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), AuthGuardModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
