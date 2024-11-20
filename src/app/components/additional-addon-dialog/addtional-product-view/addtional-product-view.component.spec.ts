import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddtionalProductViewComponent } from './addtional-product-view.component';

describe('AddtionalProductViewComponent', () => {
  let component: AddtionalProductViewComponent;
  let fixture: ComponentFixture<AddtionalProductViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddtionalProductViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddtionalProductViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
