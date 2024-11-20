import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomsNotAvailableComponent } from './rooms-not-available.component';

describe('RoomsNotAvailableComponent', () => {
  let component: RoomsNotAvailableComponent;
  let fixture: ComponentFixture<RoomsNotAvailableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoomsNotAvailableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomsNotAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
