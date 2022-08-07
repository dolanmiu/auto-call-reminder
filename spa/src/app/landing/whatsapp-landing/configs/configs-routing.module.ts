import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfigsComponent } from './configs.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigsComponent,
    children: [
      {
        path: ':configUid',
        loadChildren: () =>
          import(`./config/config.module`).then((m) => m.ConfigModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigsRoutingModule {}
