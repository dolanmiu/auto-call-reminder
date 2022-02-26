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

const redirectUnauthorizedToLogin = (
  _: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => redirectUnauthorizedTo(`login?redirectUrl=${state.url}`);
const redirectLoggedInToHome = () => redirectLoggedInTo(['']);

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes), AuthGuardModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
