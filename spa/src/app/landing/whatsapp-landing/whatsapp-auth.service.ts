import { Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { filter, map, shareReplay, tap } from 'rxjs/operators';

import {
  WhatsAppAuthResponse,
  WhatsAppAuthStatus,
  WhatsAppChat,
  WhatsAppRequireAuthAuthResponse,
  WhatsAppSuccessAuthResponse,
} from '@models';
import { filterNullish } from '@common';

@Injectable()
export class WhatsappAuthService {
  public socket!: Socket;
  private readonly subject = new BehaviorSubject<WhatsAppAuthResponse>({
    status: WhatsAppAuthStatus.PENDING,
    message: 'Pending...',
  });
  private readonly sideAuthSubject = new BehaviorSubject<
    { message: string } | undefined
  >(undefined);

  public readonly qrCode$: Observable<string>;
  public readonly isAuthenticated$: Observable<boolean>;
  public readonly message$: Observable<string>;
  public readonly chats$: Observable<WhatsAppChat[]>;

  public constructor() {
    this.qrCode$ = this.subject.pipe(
      filter((a) => a.status === WhatsAppAuthStatus.REQUIRE_AUTH),
      map((a) => a as WhatsAppRequireAuthAuthResponse),
      map((response) => response.qrCode),
      shareReplay()
    );

    this.isAuthenticated$ = this.subject.pipe(
      filter(
        (a) =>
          a.status === WhatsAppAuthStatus.SUCCESS ||
          a.status === WhatsAppAuthStatus.REQUIRE_AUTH ||
          a.status === WhatsAppAuthStatus.FAILED
      ),
      map((a) => a.status === WhatsAppAuthStatus.SUCCESS)
    );

    this.message$ = merge(this.subject, this.sideAuthSubject).pipe(
      filterNullish(),
      map((e) => e.message),
      shareReplay()
    );

    this.chats$ = this.subject.pipe(
      filter((a) => a.status === WhatsAppAuthStatus.SUCCESS),
      map((a) => a as WhatsAppSuccessAuthResponse),
      map((a) => a.chats),
      shareReplay()
    );
  }

  public connectToWhatsApp(user: User) {
    if (!this.socket) {
      this.socket = io('ws://whatsapp-auth.glitch.me/', {
        secure: true,
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

      this.socket.on(WhatsAppAuthStatus.REQUIRE_AUTH, ({ qrCode, message }) => {
        console.log(qrCode);
        this.subject.next({
          status: WhatsAppAuthStatus.REQUIRE_AUTH,
          qrCode,
          message,
        });
      });

      this.socket.on(WhatsAppAuthStatus.GETTING_CHATS, ({ message }) => {
        this.subject.next({
          status: WhatsAppAuthStatus.GETTING_CHATS,
          message,
        });
      });

      this.socket.on(WhatsAppAuthStatus.SUCCESS, ({ chats, message }) => {
        this.subject.next({
          status: WhatsAppAuthStatus.SUCCESS,
          chats,
          message,
        });
      });

      this.socket.on('SIDE_AUTHENTICATED', ({ message }) => {
        this.sideAuthSubject.next({
          message,
        });
      });
    }
  }
}
