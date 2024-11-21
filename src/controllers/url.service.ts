import { Injectable, NgModule } from '@angular/core';
import { isDevMode } from '@angular/core';
import { GalaxyService } from './galaxy.service';
import { TenantBookingEngineConfig } from '../services/bedify-classes';


@Injectable({
    providedIn: 'root'
})
export class UrlService {

  public bookingEngineConfigs : TenantBookingEngineConfig[] | undefined;

  constructor(private galaxyService: GalaxyService) {
  }

  getBackendUrl(): string {
    if (isDevMode()) {
      return "http://192.168.10.147:20005";
    }

    let id = sessionStorage.getItem("bookingEngineId");

    let ret = this.bookingEngineConfigs?.filter(o => o.bookingEngineId ==  id)[0];

    if (!ret) {
      return "";
    }

    let workerNode = ret.workerNodes.filter(o => o.appModuleId == "61a38cbc3d9ac14b2c59deee")[0];
    return "https://" + workerNode.endPoint + ":" + workerNode.port;
  }

  getCurrentTenantId() : string | undefined {
    let bookingEngineId = sessionStorage.getItem("bookingEngineId");

    if (!bookingEngineId) {
      return undefined;
    }

    let ret = this.bookingEngineConfigs?.filter(o => o.bookingEngineId == bookingEngineId)[0].tenantId;

    return ret;
  }

}
