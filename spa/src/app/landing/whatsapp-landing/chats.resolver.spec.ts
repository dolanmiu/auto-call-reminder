import { TestBed } from '@angular/core/testing';

import { ChatsResolver } from './chats.resolver';

describe('ChatsResolver', () => {
  let resolver: ChatsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ChatsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
