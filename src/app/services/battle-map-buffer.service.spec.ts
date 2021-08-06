import { TestBed } from '@angular/core/testing';

import { BattleMapBufferService } from './battle-map-buffer.service';

describe('BattleMapBufferService', () => {
  let service: BattleMapBufferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BattleMapBufferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
