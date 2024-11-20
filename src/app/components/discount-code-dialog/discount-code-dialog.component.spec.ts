import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountCodeDialogComponent } from './discount-code-dialog.component';

describe('DiscountCodeDialogComponent', () => {
  let component: DiscountCodeDialogComponent;
  let fixture: ComponentFixture<DiscountCodeDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscountCodeDialogComponent]
    });
    fixture = TestBed.createComponent(DiscountCodeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
