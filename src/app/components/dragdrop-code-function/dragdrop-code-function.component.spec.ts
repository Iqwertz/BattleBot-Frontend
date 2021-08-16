import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragdropCodeFunctionComponent } from './dragdrop-code-function.component';

describe('DragdropCodeFunctionComponent', () => {
  let component: DragdropCodeFunctionComponent;
  let fixture: ComponentFixture<DragdropCodeFunctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DragdropCodeFunctionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DragdropCodeFunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
