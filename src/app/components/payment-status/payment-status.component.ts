import { Component } from '@angular/core';
import { BedifyBookingService } from '../../../services/bedify-booking.service';
import { BedifyProgressService } from '../../../services/bedify-progress.service';

@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.component.html',
  styleUrl: './payment-status.component.scss'
})
export class PaymentStatusComponent {
  
  constructor(public bedifyService: BedifyBookingService, public progressService: BedifyProgressService) {

  }

  get success() {
    return this.bedifyService.paymentSuccess;
  }

  tryAgain() {
    const url = new URL(window.location.href);
    url.searchParams.delete("paymentstatus");
    window.history.replaceState({}, document.title, url.toString());
    
    if (this.bedifyService.group && this.bedifyService.group.sessionId) {
      this.progressService.goToCustomerInfo();  
    } else {
      this.bedifyService.goToStart();
    }
  }

  startNewBooking() {
    const url = new URL(window.location.href);
    url.searchParams.delete("paymentstatus");
    window.history.replaceState({}, document.title, url.toString());

    this.bedifyService.startNewBooking();
  }
}
