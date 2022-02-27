import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CallConfigRoutingModule } from './call-config-routing.module';
import { CallConfigComponent } from './call-config.component';

@NgModule({
  declarations: [CallConfigComponent],
  imports: [CommonModule, CallConfigRoutingModule],
})
export class CallConfigModule {}
