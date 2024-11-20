import { TestBed } from '@angular/core/testing';

import { BedifyProgressService } from './bedify-progress.service';

describe('BedifyProgressService', () => {
  let service: BedifyProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BedifyProgressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
