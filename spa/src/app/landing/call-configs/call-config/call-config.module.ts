import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@shared';

import { CallConfigRoutingModule } from './call-config-routing.module';
import { CallConfigComponent } from './call-config.component';
import { AudioRecorderModule } from './audio-recorder/audio-recorder.module';

@NgModule({
  declarations: [CallConfigComponent],
  imports: [
    CommonModule,
    CallConfigRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    AudioRecorderModule,
  ],
})
export class CallConfigModule {}
