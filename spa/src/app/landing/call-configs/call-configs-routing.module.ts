import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallConfigsComponent } from './call-configs.component';

const routes: Routes = [
  {
    path: '',
    component: CallConfigsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CallConfigsRoutingModule {}
