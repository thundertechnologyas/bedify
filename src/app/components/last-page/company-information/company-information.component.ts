import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Company } from '../../../../services/bedify-classes';
import { BedifyBookingService } from '../../../../services/bedify-booking.service';

@Component({
  selector: 'app-company-information',
  templateUrl: './company-information.component.html',
  styleUrls: ['./company-information.component.scss']
})
export class CompanyInformationComponent {

  private _company!: Company;

  public activatedFormControl = new FormControl();

  public companyForm = new FormGroup({
    name : new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    postNumber: new FormControl('', [Validators.required]),
    prefix: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor(private dataService: BedifyBookingService) {
    this.company = this.dataService.group.company

    this.companyForm.valueChanges.subscribe(res => {
      this._company.name = res.name as any;
      this._company.address = res.address as any;
      this._company.city = res.city as any;
      this._company.postNumber = res.postNumber as any;
      this._company.prefix = res.prefix as any;
      this._company.phone = res.phone as any;
      this._company.email = res.email as any;
    });

    this.activatedFormControl.valueChanges.subscribe(res => {
      this._company.activated = res;
    })
  }

  set company(company: Company) {
    this._company = company;
    this.activatedFormControl.patchValue(this._company.activated);
    this.companyForm.patchValue(this._company, { emitEvent: false});
  }

  get valid() {
    if (!this._company.activated) {
      return true;
    }

    return this.companyForm.valid;
  }
}
