import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CallLandingComponent } from './call-landing.component';

const routes: Routes = [
  {
    path: '',
    component: CallLandingComponent,
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
      },
      {
        path: 'configs',
        loadChildren: () =>
          import(`./call-configs/call-configs.module`).then(
            (m) => m.CallConfigsModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CallLandingRoutingModule {}
