import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NaturalCronPipe } from './natural-cron.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { NumeralPipe } from './numeral.pipe';
import { UrlFromBlobPipe } from './url-from-blob.pipe';
import { TimestampToDatePipe } from './timestamp-to-date.pipe';

@NgModule({
  declarations: [
    NaturalCronPipe,
    SafeHtmlPipe,
    NumeralPipe,
    UrlFromBlobPipe,
    TimestampToDatePipe,
  ],
  imports: [CommonModule],
  exports: [
    NaturalCronPipe,
    SafeHtmlPipe,
    NumeralPipe,
    UrlFromBlobPipe,
    TimestampToDatePipe,
  ],
})
export class SharedModule {}
