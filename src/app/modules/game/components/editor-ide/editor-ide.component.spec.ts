import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorIdeComponent } from './editor-ide.component';

describe('EditorIdeComponent', () => {
  let component: EditorIdeComponent;
  let fixture: ComponentFixture<EditorIdeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorIdeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorIdeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
