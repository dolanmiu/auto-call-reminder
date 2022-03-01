import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NaturalCronPipe } from './natural-cron.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { NumeralPipe } from './numeral.pipe';

@NgModule({
  declarations: [NaturalCronPipe, SafeHtmlPipe, NumeralPipe],
  imports: [CommonModule],
  exports: [NaturalCronPipe, SafeHtmlPipe, NumeralPipe],
})
export class SharedModule {}
