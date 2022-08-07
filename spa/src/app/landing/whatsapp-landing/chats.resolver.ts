import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { WhatsAppChat } from '@models';

import { WhatsappAuthService } from './whatsapp-auth.service';

@Injectable()
export class ChatsResolver implements Resolve<WhatsAppChat[]> {
  public constructor(private readonly whatsAppService: WhatsappAuthService) {}

  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<WhatsAppChat[]> {
    return this.whatsAppService.chats$;
  }
}
