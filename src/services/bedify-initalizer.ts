import { Injectable } from '@angular/core';
import { TenantBookingEngineConfig } from './bedify-classes';
import { GalaxyService } from '../controllers/galaxy.service';
import { BedifyBookingService } from './bedify-booking.service';
import { BehaviorSubject, forkJoin, map, Observable } from 'rxjs';
import { ExternalBookingController, TenantController } from '../controllers/api.service';
import { UrlService } from '../controllers/url.service';


/**
 * We need to load a bit of data upon startup,
 * this service ensures that the data is loaded properly 
 * and when done it dispatch a ready event.
 */
@Injectable({
  providedIn: 'root'
})
export class BedifyInitalizer {


  constructor(private galaxyService: GalaxyService, 
    private tenantController: TenantController,
    private bookingController: ExternalBookingController,
    private urlService: UrlService,
    private bedifyService: BedifyBookingService) {
  }

  initBookingEngines(bookingEngineConfigs: TenantBookingEngineConfig[], multiproperties: boolean) {
    this.galaxyService.init(bookingEngineConfigs).subscribe(bookingEngineConfigs => {
      this.bedifyService.bookingEngineConfigs = bookingEngineConfigs;
      this.urlService.bookingEngineConfigs = bookingEngineConfigs;
      this.loadTenantAndBookingEngineInformations(multiproperties);
    });
  }

  private loadTenantAndBookingEngineInformations(multiproperty: boolean) {
    let subs : Observable<any>[] = [];

    if (this.bedifyService.bookingEngineConfigs == null) {
      return;
    }

    let preBookingEngineId = sessionStorage.getItem("bookingEngineId") || ""; 

    if (!preBookingEngineId) {
      preBookingEngineId = this.bedifyService.bookingEngineConfigs[0].bookingEngineId;
    }
    
    this.bedifyService.bookingEngineConfigs.forEach(config => {
      sessionStorage.setItem("bookingEngineId", config.bookingEngineId);
      
      let t = forkJoin([
        this.tenantController.get(config.tenantId),
        this.bookingController.getBookingEngine(config.bookingEngineId),
        this.bookingController.getCheckinOutTime()
      ]).pipe(map(response => ({ config: config, data: response })));

      subs.push(t);
    });

    forkJoin(subs).subscribe(res => {
      
      res.forEach(r => {
        r.config.tenant = r.data[0];
        r.config.bookingEngine = r.data[1];
        r.config.checkinOutTime = r.data[2];
      });
      
      sessionStorage.setItem("bookingEngineId", preBookingEngineId);

      this.bedifyService.bookingEngineConfigs = res.map(r => r.config);
      this.urlService.bookingEngineConfigs = this.bedifyService.bookingEngineConfigs;
      this.bedifyService.bedifyInitialized(multiproperty);
    });
  }


}