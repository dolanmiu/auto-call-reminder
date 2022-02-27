import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CallConfigsComponent } from './call-configs.component';

const routes: Routes = [
  {
    path: '',
    component: CallConfigsComponent,
    children: [
      {
        path: ':callConfigUid',
        loadChildren: () =>
          import(`./call-config/call-config.module`).then(
            (m) => m.CallConfigModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CallConfigsRoutingModule {}
