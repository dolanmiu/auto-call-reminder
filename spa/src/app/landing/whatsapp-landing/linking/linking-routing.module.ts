import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LinkingComponent } from './linking.component';

const routes: Routes = [
  {
    path: '',
    component: LinkingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LinkingRoutingModule {}
