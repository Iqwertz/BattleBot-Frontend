import { TestBed } from '@angular/core/testing';
import { SimulationService } from './simulation.service';
import { BotCompilerService } from './bot-compiler.service';

describe('SimulationService', () => {
  let service: SimulationService;

  const outOfBoundsSpy = jasmine.createSpy(
    'BotCompilerService.checkPositionOutOfBounds',
    () => {
      return true;
    }
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: BotCompilerService, useValue: outOfBoundsSpy }],
    });
    service = TestBed.inject(SimulationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should execute checkPositionIsCrashed with empty array', () => {
    expect(service.checkPositionIsCrashed([])).toEqual(true);
  });

  it('should execute checkPositionIsCrashed with filled array', () => {
    service.simulation.obstacleMap = service.generateObstacleMap(
      [20, 20],
      true
    );

    expect(service.checkPositionIsCrashed([4, 6])).toEqual(false);
  });
});
