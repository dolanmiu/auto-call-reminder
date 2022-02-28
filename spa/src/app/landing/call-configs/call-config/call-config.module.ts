import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { CallConfigRoutingModule } from './call-config-routing.module';
import { CallConfigComponent } from './call-config.component';

@NgModule({
  declarations: [CallConfigComponent],
  imports: [
    CommonModule,
    CallConfigRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
})
export class CallConfigModule {}
