import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CallLandingRoutingModule } from './call-landing-routing.module';
import { CallLandingComponent } from './call-landing.component';


@NgModule({
  declarations: [
    CallLandingComponent
  ],
  imports: [
    CommonModule,
    CallLandingRoutingModule
  ]
})
export class CallLandingModule { }
