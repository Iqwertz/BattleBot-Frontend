import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragdropPreviewComponent } from './dragdrop-preview.component';

describe('DragdropPreviewComponent', () => {
  let component: DragdropPreviewComponent;
  let fixture: ComponentFixture<DragdropPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DragdropPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DragdropPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
