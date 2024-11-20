import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BedifyBookingHeader } from './bedify-booking-header.component';

describe('GroupConfigComponent', () => {
  let component: BedifyBookingHeader;
  let fixture: ComponentFixture<BedifyBookingHeader>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BedifyBookingHeader]
    });
    fixture = TestBed.createComponent(BedifyBookingHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
