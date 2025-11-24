import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PulseOpenStatusComponent } from './pulse-open-status.component';

describe('PulseOpenStatusComponent', () => {
  let component: PulseOpenStatusComponent;
  let fixture: ComponentFixture<PulseOpenStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PulseOpenStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PulseOpenStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
