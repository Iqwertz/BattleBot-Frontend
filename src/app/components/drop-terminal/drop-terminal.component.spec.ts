import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropTerminalComponent } from './drop-terminal.component';

describe('DropTerminalComponent', () => {
  let component: DropTerminalComponent;
  let fixture: ComponentFixture<DropTerminalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropTerminalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
