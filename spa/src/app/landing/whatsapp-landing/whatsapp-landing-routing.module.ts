import { NgModule } from '@angular/core';
import { AuthGuard } from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';

import { redirectUnauthorizedToLogin } from '../landing-routing.module';
import { ChatsResolver } from './chats.resolver';
import { WhatsappAuthGuard } from './whatsapp-auth.guard';
import { WhatsappLandingComponent } from './whatsapp-landing.component';

const routes: Routes = [
  {
    path: '',
    component: WhatsappLandingComponent,
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
        canActivate: [AuthGuard, WhatsappAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
      },
      {
        path: 'configs',
        loadChildren: () =>
          import(`./configs/configs.module`).then((m) => m.ConfigsModule),
        canActivate: [AuthGuard, WhatsappAuthGuard],
        resolve: { chats: ChatsResolver },
        data: { authGuardPipe: redirectUnauthorizedToLogin },
      },
      {
        path: 'linking',
        loadChildren: () =>
          import(`./linking/linking.module`).then((m) => m.LinkingModule),
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WhatsappDashboardRoutingModule {}
