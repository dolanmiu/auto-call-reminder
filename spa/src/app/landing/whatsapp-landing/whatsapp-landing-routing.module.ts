import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
        canActivate: [WhatsappAuthGuard],
      },
      {
        path: 'configs',
        loadChildren: () =>
          import(`./configs/configs.module`).then((m) => m.ConfigsModule),
        canActivate: [WhatsappAuthGuard],
        resolve: { chats: ChatsResolver },
      },
      {
        path: 'linking',
        loadChildren: () =>
          import(`./linking/linking.module`).then((m) => m.LinkingModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WhatsappDashboardRoutingModule {}
