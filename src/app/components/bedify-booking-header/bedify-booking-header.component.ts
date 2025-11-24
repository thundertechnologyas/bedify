import { AfterViewInit, Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BedifyBookingService } from '../../../services/bedify-booking.service';
import { RoomSelectorComponent } from '../room-selector/room-selector.component';
import { BedifyInitalizer } from '../../../services/bedify-initalizer';
import { DiscountCodeDialogComponent } from '../discount-code-dialog/discount-code-dialog.component';
import { TranslationService } from '../../../services/translation.service';

import data from '../../../assets/data/availableLangs.json';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';

@Component({
  selector: 'app-bedify-booking-header',
  templateUrl: './bedify-booking-header.component.html',
  styleUrls: ['./bedify-booking-header.component.scss']
})
export class BedifyBookingHeader implements AfterViewInit {

  public bookingResponseCode = "";
  public bookingCodeResponseMetaData = {};

  @Input("configs")
  public configs = "";

  @Input("successurl")
  public successurl = "";

  @Input("failedurl")
  public failedurl = "";

  public availableLangs = data;

  @Input("defaultlang")
  public _selectedLang = "en";
  
  @Input("multilanguage")
  public multiLanguage = true;

  @Input("multiproperty")
  public multiProperty = false;

  @Input("standaloneredirecturl")
  public standaloneredirecturl = "";

  startFilter = (d: Date | null): boolean => {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    return (d || new Date()).getTime() > date.getTime();
  };

  endFilter = (d: Date | null): boolean => {
    var date = new Date(this.group.value.checkin || new Date());
    return (d || new Date()).getTime() > date.getTime();
  };

  public group = new FormGroup({
    checkin: new FormControl('', [Validators.required]),
    checkout: new FormControl('', [Validators.required]),
    discountCode: new FormControl(''),
    bookingEngineId: new FormControl('')
  });

  discuntCode: any;
  tenants: any = [];

  constructor(public dataService: BedifyBookingService,
    private bedifyInitilizer: BedifyInitalizer,
    private translationService: TranslationService,
    private dialog: MatDialog) {

      this.patchValues();

      if (sessionStorage.getItem("bedify_booking_selected_lang")) {
        this._selectedLang = sessionStorage.getItem("bedify_booking_selected_lang") as any;
      }
      
      translationService.changeLang(this._selectedLang);
      
      bedifyInitilizer.onReady().subscribe(res => {
      });

      this.group.valueChanges.subscribe(res => {

        let checkinDate = new Date(res.checkin as any);
        let checkoutDate = new Date(res.checkout as any);
        
        if (checkoutDate < checkinDate) {
          let nextDay = new Date(checkinDate);
          nextDay.setDate(checkinDate.getDate() + 1);
          this.group.patchValue( {
            checkout : nextDay as any
          });
          return;
        }

        this.dataService.headerChanged(res.checkin, res.checkout, res.discountCode, res.bookingEngineId, this.multiProperty);
      });

      this.dataService.headerSubjectNotEmit.subscribe(res => {
        this.patchValues();
      })
  }

  patchValues() {
    this.group.patchValue({
      checkin: this.dataService.headerFilter.checkin as any,
      checkout: this.dataService.headerFilter.checkout as any,
      discountCode : this.dataService.headerFilter.discountCode,
      bookingEngineId : this.dataService.headerFilter.bookingEngineId
    }, {
      emitEvent: false
    });
  }

  ngAfterViewInit(): void {
    
    this.tenants = JSON.parse(this.configs);

    if (!this.successurl && !this.failedurl) {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('paymentstatus', 'success');
      this.successurl = currentUrl.href;
      currentUrl.searchParams.set('paymentstatus', 'failed');
      this.failedurl = currentUrl.href;
    }

    this.dataService.setUrl(this.successurl, this.failedurl);

    this.bedifyInitilizer.initBookingEngines(this.tenants);
  }

  get checkoutDate() {
    if (!this.dataService.getGroup().checkout) {
      let ret = this.dataService.group.checkin;

      if (ret) {
        ret.setDate(ret.getDate() + 1);
        return ret;
      }

      return null;
    }

    return this.dataService.group.checkout;
  }

  get roomsAndGuests() {
    let rooms = this.dataService.group.rooms;
    let guests = 0;
    rooms.forEach(r => {
      guests += r.adults;
    });

    return "Rooms: " + rooms.length + ", guests: " + guests;
  }

  showRoomConfig() {
    let dialogRef = this.dialog.open(RoomSelectorComponent);    
  }

  showDiscount() {
    let dialogRef = this.dialog.open(DiscountCodeDialogComponent);    

    dialogRef.afterClosed().subscribe(res => {
      this.group.patchValue({
        discountCode: res
      });
    })
  }


  get selectedLang() {
    return this.availableLangs.filter(o => o.code == this._selectedLang.toUpperCase())[0];
  }

  selectLanguage() {
    let ref = this.dialog.open(LanguageSelectorComponent);
    ref.afterClosed().subscribe(res => {
      if (res) {
        this.translationService.changeLang(res.code.toLowerCase());
        this._selectedLang = res.code;
        sessionStorage.setItem("bedify_booking_selected_lang", res.code.toLowerCase());
      }
    })
  }

  search() {
    window.location.href = this.standaloneredirecturl;
  }
}

