import { AfterViewInit, Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs';
import data from '../../../../assets/data/prefixlist.json';
import { BedifyBookingService } from '../../../../services/bedify-booking.service';
import { GuestInfo, TenantBookingEngineConfig } from '../../../../services/bedify-classes';

@Component({
  selector: 'app-guest-info',
  templateUrl: './guest-info.component.html',
  styleUrls: ['./guest-info.component.scss']
})
export class GuestInfoComponent implements AfterViewInit {
  private _guestInfo!: GuestInfo;

  public prefixes = data;

  public formGroup = new FormGroup({
    firstName : new FormControl(''),
    lastName : new FormControl(''),
    email : new FormControl(''),
    phoneNumber : new FormControl(''),
    childAge : new FormControl(''),
    child : new FormControl(''),
    prefix : new FormControl('')
  })

  filteredPrefixes: any;

  selectedPrefix: any;

  constructor(private dataService: BedifyBookingService) {
    this.formGroup.valueChanges.subscribe(res => {
      this._guestInfo.firstName = res.firstName as string;
      this._guestInfo.lastName = res.lastName as string;
      this._guestInfo.email = res.email as string;
      this._guestInfo.child = res.child as any;
      this._guestInfo.childAge = res.childAge as any;
      this._guestInfo.phoneNumber = res.phoneNumber as string;
      // this.dataService.saveToSession();  TODO
    });

    this.filteredPrefixes = this.formGroup.controls.prefix.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filteredPrefixes(state) : this.prefixes.slice())),
    );
  }

  ngAfterViewInit(): void {
    if (!this.selectedPrefix) {
      let config = this.dataService.getBookingEngineConfig();

      if (config != null) {
        let prefix = (<TenantBookingEngineConfig>config).bookingEngine?.defaultPrefix;
        this.countryChanged(this.prefixes.filter((o: any) => o != null && o.dial_code == prefix)[0]);
      }
      
    }
  }

  @Input("guest")
  set guestInfo(guestInfo: GuestInfo) {
    this._guestInfo = guestInfo;

    this.formGroup.patchValue({
      firstName : this._guestInfo.firstName,
      lastName : this._guestInfo.lastName,
      email : this._guestInfo.email,
      phoneNumber : this._guestInfo.phoneNumber,
      child : this._guestInfo.child as any,
      childAge : this._guestInfo.childAge as any
    }, { emitEvent: false });

    this.countryChanged(this.prefixes.filter((o: any) => o != null && o.dial_code == this._guestInfo.phonePrefix)[0]);

    this.formGroup.get("firstName")?.addValidators([Validators.required]);
    this.formGroup.get("lastName")?.addValidators([Validators.required]);

    if (this.guestInfo.guestIndex == 1) {
      this.formGroup.get("email")?.addValidators([Validators.required, Validators.email]);
      this.formGroup.get("phoneNumber")?.addValidators([Validators.required]);
    }
  }

  get guestInfo() {
    return this._guestInfo;
  }

  get validCountry() {
    return this.getPrefixPrint() == this.formGroup.value['prefix'];
  }

  get valid() {
    return this.formGroup.valid && this.selectedPrefix && this.selectedPrefix.dial_code && this.validCountry;
  }

  private _filteredPrefixes(value: string): any[] {
    const filterValue = value.toLowerCase();

    let retlist = this.prefixes.filter((prefix: any) =>  {
      let dialcode = "" + prefix.dial_code;
      return prefix.name.toLowerCase().includes(filterValue) || dialcode.toLowerCase().includes(filterValue)
    });

    if (retlist.length == 0) {
      return this.prefixes;
    }

    return retlist;
  }
  
  getPrefixPrint() {

    if (!this.selectedPrefix) {
      return "";
    }

    return this.selectedPrefix.emoji + ' ' + this.selectedPrefix.dial_code;
  }

  countryChanged(prefix: any) {
    if (!prefix) {
      return;
    }
    
    this.selectedPrefix = prefix;
    this.formGroup.patchValue({
      prefix: this.getPrefixPrint()
    }, { emitEvent: false });
    
    this._guestInfo.phonePrefix = this.selectedPrefix.dial_code;
    // this.dataService.saveToSession(); - TODO
  }
}
