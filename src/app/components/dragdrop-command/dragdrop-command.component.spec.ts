import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragdropCommandComponent } from './dragdrop-command.component';

describe('DragdropCommandComponent', () => {
  let component: DragdropCommandComponent;
  let fixture: ComponentFixture<DragdropCommandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DragdropCommandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DragdropCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
