import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioRecorderComponent } from './audio-recorder.component';
import { SharedModule } from '@shared';

@NgModule({
  declarations: [AudioRecorderComponent],
  imports: [CommonModule, SharedModule],
  exports: [AudioRecorderComponent],
})
export class AudioRecorderModule {}
