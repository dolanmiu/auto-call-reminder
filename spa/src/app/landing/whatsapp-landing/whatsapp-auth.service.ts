import { Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';

import {
  WhatsAppAuthResponse,
  WhatsAppAuthStatus,
  WhatsAppRequireAuthAuthResponse,
} from '@models';

@Injectable()
export class WhatsappAuthService {
  public socket!: Socket;
  private readonly subject = new BehaviorSubject<WhatsAppAuthResponse>({
    status: WhatsAppAuthStatus.PENDING,
  });

  public readonly qrCode$: Observable<string>;
  public readonly isAuthenticated$: Observable<boolean>;

  public constructor() {
    this.qrCode$ = this.subject.pipe(
      filter((a) => a.status === WhatsAppAuthStatus.REQUIRE_AUTH),
      map((a) => a as WhatsAppRequireAuthAuthResponse),
      map((response) => response.qrCode),
      shareReplay()
    );

    this.isAuthenticated$ = this.subject.pipe(
      filter((a) => a.status !== WhatsAppAuthStatus.PENDING),
      map((a) => a.status === WhatsAppAuthStatus.SUCCESS)
    );
  }

  public connectToWhatsApp(user: User) {
    if (!this.socket) {
      this.socket = io('ws://whatsapp-auth.glitch.me/', {
        reconnectionDelayMax: 10000,
        auth: {
          token: '123',
        },
        query: {
          'my-key': 'my-value',
        },
      });

      this.socket.on('connect', () => {
        console.log('connected');
        this.socket.emit('authenticate', { userUid: user.uid });
      });

      this.socket.on('REQUIRE_AUTH', ({ qrCode }) => {
        console.log(qrCode);
        this.subject.next({
          status: WhatsAppAuthStatus.REQUIRE_AUTH,
          qrCode,
        });
      });

      this.socket.on('SUCCESS', ({ chats }) => {
        console.log(chats);
        this.subject.next({
          status: WhatsAppAuthStatus.SUCCESS,
          chats,
        });
      });
    }
  }
}
