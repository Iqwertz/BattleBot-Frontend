import { TestBed } from '@angular/core/testing';

import { SimulationStatsService } from './simulation-stats.service';

describe('SimulationStatsService', () => {
  let service: SimulationStatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimulationStatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
