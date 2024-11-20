import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalAddonDialogComponent } from './additional-addon-dialog.component';

describe('AdditionalAddonDialogComponent', () => {
  let component: AdditionalAddonDialogComponent;
  let fixture: ComponentFixture<AdditionalAddonDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdditionalAddonDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalAddonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
