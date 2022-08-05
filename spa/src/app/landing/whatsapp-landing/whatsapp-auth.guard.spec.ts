import { TestBed } from '@angular/core/testing';

import { WhatsappAuthGuard } from './whatsapp-auth.guard';

describe('WhatsappAuthGuard', () => {
  let guard: WhatsappAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(WhatsappAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
