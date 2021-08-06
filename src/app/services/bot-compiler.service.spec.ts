import { TestBed } from '@angular/core/testing';

import { BotCompilerService } from './bot-compiler.service';

describe('BotCompilerService', () => {
  let service: BotCompilerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BotCompilerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
