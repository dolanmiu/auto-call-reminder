import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from 'firebase/firestore';

import { Call } from '@models';

@Pipe({
  name: 'sortCalls',
})
export class SortCallsPipe implements PipeTransform {
  public transform(calls: Call<Timestamp>[]): Call<Timestamp>[] {
    return [...calls].sort(
      (a, b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime()
    );
  }
}
