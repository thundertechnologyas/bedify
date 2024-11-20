import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestInfosComponent } from './guest-infos.component';

describe('GuestInfosComponent', () => {
  let component: GuestInfosComponent;
  let fixture: ComponentFixture<GuestInfosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestInfosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
