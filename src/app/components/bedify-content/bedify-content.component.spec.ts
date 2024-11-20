import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BedifyContentComponent } from './bedify-content.component';

describe('BedifyContentComponent', () => {
  let component: BedifyContentComponent;
  let fixture: ComponentFixture<BedifyContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BedifyContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BedifyContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
