import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleMapControlsComponent } from './battle-map-controls.component';

describe('BattleMapControlsComponent', () => {
  let component: BattleMapControlsComponent;
  let fixture: ComponentFixture<BattleMapControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BattleMapControlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleMapControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
