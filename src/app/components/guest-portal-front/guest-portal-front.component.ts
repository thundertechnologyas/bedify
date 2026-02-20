import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BedifyBookingService } from '../../../services/bedify-booking.service';
import { GalaxyService } from '../../../controllers/galaxy.service';
import { UrlService } from '../../../controllers/url.service';
import { GuestPortalComponent } from '../guest-portal/guest-portal.component';

@Component({
  selector: 'app-guest-portal-front',
  templateUrl: './guest-portal-front.component.html',
  styleUrl: './guest-portal-front.component.scss'
})
export class GuestPortalFrontComponent {
  tenantId: any;
  bookingEngineId: any;
  public loaded = false;

  @ViewChild("content")
  private content !: GuestPortalComponent;

  constructor(route: ActivatedRoute, private bedifyService: BedifyBookingService, private galaxyService: GalaxyService, private urlService: UrlService) {
    this.tenantId = route.snapshot.params['tenantId'];
    this.bookingEngineId = "guestportal";

    sessionStorage.setItem("tenantId", this.tenantId);
    sessionStorage.setItem("bookingEngineId", this.bookingEngineId);

    this.galaxyService.initByTenantId(this.tenantId).subscribe(res => {
      this.bedifyService.bookingEngineConfigs = [res];
      this.urlService.bookingEngineConfigs = this.bedifyService.bookingEngineConfigs;
      this.loaded = true;
      this.content.load();
    })
  }

  get configs() {
    return JSON.stringify([{
      tenantId : this.tenantId,
      bookingEngineId : this.bookingEngineId
    }]);
  }

  get logo() {
    return "https://auth.thundertech.no/api/tenantcontroller/logo?tenantId=" +this.tenantId;
  }
}
