import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateLobbyCodeComponent } from './private-lobby-code.component';

describe('PrivateLobbyCodeComponent', () => {
  let component: PrivateLobbyCodeComponent;
  let fixture: ComponentFixture<PrivateLobbyCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivateLobbyCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateLobbyCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
