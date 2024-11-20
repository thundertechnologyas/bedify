import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAndConditionDialogComponent } from './terms-and-condition-dialog.component';

describe('TermsAndConditionDialogComponent', () => {
  let component: TermsAndConditionDialogComponent;
  let fixture: ComponentFixture<TermsAndConditionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TermsAndConditionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermsAndConditionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
