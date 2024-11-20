import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestInfoComponent } from './guest-info.component';

describe('GuestInfoComponent', () => {
  let component: GuestInfoComponent;
  let fixture: ComponentFixture<GuestInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
