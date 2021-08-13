import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicLobbysComponent } from './public-lobbys.component';

describe('PublicLobbysComponent', () => {
  let component: PublicLobbysComponent;
  let fixture: ComponentFixture<PublicLobbysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicLobbysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicLobbysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
