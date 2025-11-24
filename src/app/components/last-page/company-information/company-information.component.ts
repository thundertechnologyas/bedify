import { AfterViewInit, Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Company, TenantBookingEngineConfig } from '../../../../services/bedify-classes';
import { BedifyBookingService } from '../../../../services/bedify-booking.service';
import data from '../../../../assets/data/prefixlist.json';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'app-company-information',
  templateUrl: './company-information.component.html',
  styleUrls: ['./company-information.component.scss']
})
export class CompanyInformationComponent implements AfterViewInit{

  private _company!: Company;

  public country = new FormControl();
  
  public countries = data;

  public activatedFormControl = new FormControl();
  
  public filteredCountries: any;

  public companyForm = new FormGroup({
    name : new FormControl('', [Validators.required]),
    vatNumber : new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    postNumber: new FormControl('', [Validators.required]),
    prefix: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    country : new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email])
  });

  selectedPrefix: any;

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
      this._company.countrycode = res.country as any;
      this._company.vatNumber = res.vatNumber as any;
    });

    this.activatedFormControl.valueChanges.subscribe(res => {
      this._company.activated = res;
    })

    this.filteredCountries = this.companyForm.controls.country.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filteredPrefixes(state) : this.countries.slice())),
    );
  }

  ngAfterViewInit(): void {
    if (!this.selectedPrefix) {
      let config = this.dataService.getBookingEngineConfig();

      if (config != null) {
        let prefix = (<TenantBookingEngineConfig>config).bookingEngine?.defaultPrefix;
        this.countryChanged(this.countries.filter((o: any) => o != null && o.dial_code == prefix)[0]);
      }
      
    }
  }

  private _filteredPrefixes(value: string): any[] {
    const filterValue = value.toLowerCase();

    let retlist = this.countries.filter((prefix: any) =>  {
      let dialcode = "" + prefix.dial_code;
      return prefix.name.toLowerCase().includes(filterValue) || dialcode.toLowerCase().includes(filterValue)
    });

    if (retlist.length == 0) {
      return this.countries;
    }

    return retlist;
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

  getPrefixPrint() {

    if (!this.selectedPrefix) {
      return "";
    }

    return this.selectedPrefix.emoji + ' ' + this.selectedPrefix.name;
  }

  countryChanged(prefix: any) {
    if (!prefix) {
      return;
    }
    
    this.selectedPrefix = prefix;
    this.companyForm.patchValue({
      country: this.getPrefixPrint()
    }, { emitEvent: false });

    this.companyForm.controls.vatNumber.clearValidators();

    if (this.selectedPrefix.code == "NO") {
      this.companyForm.controls.vatNumber.addValidators([Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern(/^[0-9]*$/)]);
    }
    
    
    //this._guestInfo.phonePrefix = this.selectedPrefix.dial_code;
    // this.dataService.saveToSession(); - TODO
  }
  

}
