import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestPortalFrontComponent } from './guest-portal-front.component';

describe('GuestPortalFrontComponent', () => {
  let component: GuestPortalFrontComponent;
  let fixture: ComponentFixture<GuestPortalFrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GuestPortalFrontComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestPortalFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
