import { TestBed } from '@angular/core/testing';

import { WhatsappAuthService } from './whatsapp-auth.service';

describe('WhatsappAuthService', () => {
  let service: WhatsappAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WhatsappAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
