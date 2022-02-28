import { Pipe, PipeTransform } from '@angular/core';

const getCronString = require('@darkeyedevelopers/natural-cron.js');

@Pipe({
  name: 'naturalCron',
})
export class NaturalCronPipe implements PipeTransform {
  public transform(value: string): string {
    return getCronString(value);
  }
}
