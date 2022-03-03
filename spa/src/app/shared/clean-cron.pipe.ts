import { Pipe, PipeTransform } from '@angular/core';

import { cleanCron } from '@util';

@Pipe({
  name: 'cleanCron',
})
export class CleanCronPipe implements PipeTransform {
  transform(value: string): string {
    return cleanCron(value);
  }
}
