import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CompanyInformationComponent } from './company-information/company-information.component';
import { GuestInfosComponent } from './guest-infos/guest-infos.component';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BedifyBookingService } from '../../../services/bedify-booking.service';
import { ExternalBookingController } from '../../../controllers/api.service';
import { BookingStartPaymentRequest, RoomConfig, TenantBookingEngineConfig } from '../../../services/bedify-classes';
import { BedifyProgressService } from '../../../services/bedify-progress.service';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TermsAndConditionDialogComponent } from '../terms-and-condition-dialog/terms-and-condition-dialog.component';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-last-page',
  templateUrl: './last-page.component.html',
  styleUrls: ['./last-page.component.scss']
})
export class LastPageComponent implements OnDestroy, AfterViewInit{

  @ViewChild("companyInfo")
  private companyInfo!: CompanyInformationComponent;

  @ViewChild("guestinfos")
  private guestinfos!: GuestInfosComponent;

  public waitingForPaymentTransfer = false;
  
  public termsAndCondtions = new FormControl(false);

  public paymentOptionType = new FormControl("");

  get companySelected() {
    return this.dataService.getGroup().companySelected;
  }

  constructor(public dataService: BedifyBookingService, 
    private progressService: BedifyProgressService,
    private dialog: MatDialog,
    private router: Router,
     private bookingController: ExternalBookingController) {
      this.progressService.onNext().subscribe(res => {
        this.selectPaymentMethod();
      });
  }

  ngAfterViewInit(): void {
    
  }
  
  selectPaymentMethod() {
    console.log(this.hasOnlinePaymentPaymentMethods);
    if (this.hasOnlinePaymentPaymentMethods) {
      this.paymentOptionType.patchValue("startPaymentDirectFalse");
    } else if (this.hasPayLater) {
      this.paymentOptionType.patchValue("payOnCheckin");
    } else if (this.dataService.getGroup().hotelCollect) {
      this.paymentOptionType.patchValue("payWithHotelCollect");
    }
  
  }

  ngOnDestroy(): void {
  }

  payOnCheckin() {
    this.dataService.getGroup().payOnArrival = true;
    
    this.bookingController.create(this.dataService.getGroup()).subscribe(res => {
      this.dataService.bookingSessionStarted(res.sessionId);
      if (res) {
        this.progressService.reservationCompleted();
      }
    });
  }

  startPaymentDirect(partial : boolean = false) {
    this.dataService.getGroup().payOnArrival = false;
    this.startPayment(partial);
  }

  get hasOnlinePaymentPaymentMethods() {
    let config = this.dataService.getBookingEngineConfig();

    let tenatConfig = (<TenantBookingEngineConfig>config).bookingEngine;

    if (tenatConfig) {
      return tenatConfig.paymentTypeIds?.length > 0;
    }
    
    return false;
  }

  payWithHotelCollect() {
    if (!this.valid) {
      return;
    }

    this.bookingController.create(this.dataService.getGroup()).subscribe(res => {
      this.dataService.bookingSessionStarted(res.sessionId);
      this.selectPaymentMethod();
      if (res) {
        this.progressService.reservationCompleted();
      }
    });
  }
  
  startPayment(partial : boolean = false) {
    if (!this.valid) {
      return;
    }

    this.waitingForPaymentTransfer = true;
      
    let config = this.dataService.getBookingEngineConfig();
    
    let paymentTypeId = "";

    if (config) {
      paymentTypeId = (<TenantBookingEngineConfig>config).bookingEngine?.paymentTypeIds[0] as string;  
    }

    // TODO - Make a proper selection for the payment method
    this.bookingController.create(this.dataService.getGroup()).subscribe(res => {
      this.dataService.bookingSessionStarted(res.sessionId);

      let paymentRequest = new BookingStartPaymentRequest();
      paymentRequest.groupId = res.id;
      paymentRequest.paymentTypeId = paymentTypeId;
      paymentRequest.paymentSuccessUrl = this.dataService.successUrl;
      paymentRequest.paymentFailureUrl = this.dataService.failedUrl;
      paymentRequest.partial = partial;

      this.bookingController.startPayment(paymentRequest).subscribe(res => {
        this.waitingForPaymentTransfer = false;
        window.document.location = res.remotePaymentWindowUrl;
      });
    });
  }

  get valid() {
    if (this.dataService && this.guestinfos && this.dataService.getGroup().companySelected) {
      return this.guestinfos.valid;
    }

    if (!this.companyInfo) {
      return false;
    }

    if (this.hasTermsAndConditions && !this.termsAndCondtions.value) {
      return false;
    }

    return this.companyInfo.valid && this.guestinfos.valid;
  }

  allSelected() {
    let allSelected = true;

    let group = this.dataService.getGroup();
    for (let room of group.rooms) {
      
      if (!room.selectedRentalObjectId) {
        allSelected = false;
      }
    }

    return allSelected;
  }

  get hasPayLater() : boolean {

    let engine = (<TenantBookingEngineConfig>this.dataService.getBookingEngineConfig()).bookingEngine;
    
    if (!engine) {
      return false;
    }
    
    return engine.payLater;
  }

  get total() {
    let total = 0;
    
    this.dataService.group.rooms.forEach(r => {
      let configInstance = new RoomConfig();
      Object.assign(configInstance, r);
      let room = configInstance.getSelectedRoom();
      let variation = room.availableVariations.filter(o => o.variationId == room.selectedVariation)[0];
      
      if (room.selectedOptionAddons) {
        room.selectedOptionAddons.forEach(o => {
          total += o.extraCost;
        });
      }

      total += variation.totalPrice;
    });

    return total;
  }

  get totalPartial() {
    return this.total * (30 / 100);
  }

  showTermsAndConditions() {
    let ref = this.dialog.open(TermsAndConditionDialogComponent);
  }

  get hasTermsAndConditions() {
    let bookingEngine = this.dataService.getBookingEngineConfig();

    if (!bookingEngine || bookingEngine.bookingEngine == null) {
        return false;
    }

    return bookingEngine.bookingEngine.termsAndConditions.trim() != "";
  }

  initPayment() {
    switch(this.paymentOptionType.value) {
      case "startPaymentDirectTrue": {
        this.startPaymentDirect(true);
        break;
      }

      case "startPaymentDirectFalse": {
        this.startPaymentDirect(false);
        break;
      }

      case "payOnCheckin": {
        this.payOnCheckin();
        break;
      }
      
    }

    console.log(this.paymentOptionType);
  }
}
