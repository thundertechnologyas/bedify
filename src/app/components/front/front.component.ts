import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BedifyBookingService } from '../../../services/bedify-booking.service';

@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrl: './front.component.scss'
})
export class FrontComponent {
  tenantId: any;
  bookingEngineId: any;
  
  constructor(route: ActivatedRoute, private bedifyService: BedifyBookingService) {
    this.tenantId = route.snapshot.params['tenantId'];
    this.bookingEngineId = route.snapshot.params['bookingEngineId']; 
  }

  get configs() {
    return JSON.stringify([{
      tenantId : this.tenantId,
      bookingEngineId : this.bookingEngineId
    }]);
  }

  get logo() {
    let config = this.bedifyService.getBookingEngineConfig();
    
    return "https://auth.thundertech.no/api/tenantcontroller/logo?tenantId=" +config?.tenantId; // TODO; + this.apiService.tenant.id;
  }
}
