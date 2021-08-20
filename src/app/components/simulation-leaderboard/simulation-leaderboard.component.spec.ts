import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationLeaderboardComponent } from './simulation-leaderboard.component';

describe('SimulationLeaderboardComponent', () => {
  let component: SimulationLeaderboardComponent;
  let fixture: ComponentFixture<SimulationLeaderboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulationLeaderboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
