import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NaturalCronPipe } from './natural-cron.pipe';

@NgModule({
  declarations: [NaturalCronPipe],
  imports: [CommonModule],
  exports: [NaturalCronPipe],
})
export class SharedModule {}
