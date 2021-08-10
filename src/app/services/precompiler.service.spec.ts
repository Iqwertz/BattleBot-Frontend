import { TestBed } from '@angular/core/testing';

import { PrecompilerService } from './precompiler.service';

describe('PrecompilerService', () => {
  let service: PrecompilerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrecompilerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
