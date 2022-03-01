import * as numeral from 'numeral';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numeral',
})
export class NumeralPipe implements PipeTransform {
  public transform(value: unknown, format: string): string {
    return numeral(value).format(format);
  }
}
