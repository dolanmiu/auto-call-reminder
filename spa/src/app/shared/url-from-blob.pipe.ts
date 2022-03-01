import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'urlFromBlob',
})
export class UrlFromBlobPipe implements PipeTransform {
  public transform(blob?: Blob): string {
    return blob ? URL.createObjectURL(blob) : '';
  }
}
