import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationSettingsComponent } from './simulation-settings.component';

describe('SimulationSettingsComponent', () => {
  let component: SimulationSettingsComponent;
  let fixture: ComponentFixture<SimulationSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulationSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
