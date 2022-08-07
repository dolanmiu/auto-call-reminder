import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalMessengerService {
  private readonly messageSubject = new BehaviorSubject<string>('');
  public message$ = this.messageSubject.asObservable();

  constructor() {}

  public sendMessage(message: string): void {
    this.messageSubject.next(message);
  }
}
