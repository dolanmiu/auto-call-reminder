import { Pipe, PipeTransform } from '@angular/core';
import { map } from 'rxjs/operators';
import { WhatsAppChat } from '@models';
import { WhatsappAuthService } from '../whatsapp-auth.service';
import { Observable } from 'rxjs';

@Pipe({
  name: 'whatsappIdToName',
})
export class WhatsappIdToNamePipe implements PipeTransform {
  public constructor(private readonly whatsappService: WhatsappAuthService) {}

  public transform(id: string): Observable<WhatsAppChat> {
    return this.whatsappService.chatsLookUpDictionary$.pipe(map((e) => e[id]));
  }
}
