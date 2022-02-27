import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CallConfigsRoutingModule } from './call-configs-routing.module';
import { CallConfigsComponent } from './call-configs.component';

@NgModule({
  declarations: [CallConfigsComponent],
  imports: [CommonModule, CallConfigsRoutingModule],
})
export class CallConfigsModule {}
