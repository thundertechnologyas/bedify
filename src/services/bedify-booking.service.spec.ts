import { TestBed } from '@angular/core/testing';

import { BedifyBookingService } from './bedify-booking.service';

describe('BedifyBookingService', () => {
  let service: BedifyBookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BedifyBookingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
