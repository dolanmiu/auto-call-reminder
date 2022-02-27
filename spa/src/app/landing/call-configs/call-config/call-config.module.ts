import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CallConfigRoutingModule } from './call-config-routing.module';
import { CallConfigComponent } from './call-config.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CallConfigComponent],
  imports: [CommonModule, CallConfigRoutingModule, ReactiveFormsModule],
})
export class CallConfigModule {}
