import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragdropLogicCommandComponent } from './dragdrop-logic-command.component';

describe('DragdropLogicCommandComponent', () => {
  let component: DragdropLogicCommandComponent;
  let fixture: ComponentFixture<DragdropLogicCommandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DragdropLogicCommandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DragdropLogicCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
