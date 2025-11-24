import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BedifyBookingService } from '../../../services/bedify-booking.service';

@Component({
  selector: 'app-guest-portal-front',
  templateUrl: './guest-portal-front.component.html',
  styleUrl: './guest-portal-front.component.scss'
})
export class GuestPortalFrontComponent {
  tenantId: any;
  bookingEngineId: any;
  
  constructor(route: ActivatedRoute, private bedifyService: BedifyBookingService) {
    this.tenantId = route.snapshot.params['tenantId'];
    this.bookingEngineId = route.snapshot.params['bookingEngineId']; 
    sessionStorage.setItem("tenantId", this.tenantId);
  }

  get configs() {
    return JSON.stringify([{
      tenantId : this.tenantId,
      bookingEngineId : this.bookingEngineId
    }]);
  }

  get logo() {
    return "https://auth.thundertech.no/api/tenantcontroller/logo?tenantId=" +this.tenantId; // TODO; + this.apiService.tenant.id;
  }
}
