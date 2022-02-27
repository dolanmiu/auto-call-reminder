import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthResolver } from '@shared';

import { CallConfigComponent } from './call-config.component';

const routes: Routes = [
  {
    path: '',
    component: CallConfigComponent,
    resolve: { user: AuthResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CallConfigRoutingModule {}
