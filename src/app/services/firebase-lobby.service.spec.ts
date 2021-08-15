import { TestBed } from '@angular/core/testing';

import { FirebaseLobbyService } from './firebase-lobby.service';

describe('FirebaseLobbyService', () => {
  let service: FirebaseLobbyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseLobbyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
