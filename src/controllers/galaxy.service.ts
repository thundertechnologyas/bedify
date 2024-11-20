import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, Subject } from 'rxjs';
import { TenantBookingEngineConfig } from '../services/bedify-classes';
import { ExternalBookingController, TenantController } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class GalaxyService {
  

  private moduleSubject = new Subject<any>();

  //private bookingEngineConfigs : TenantBookingEngineConfig[] = [];

  constructor(private httpService: HttpClient) {

  }

  public init(bookingEngineConfigs: TenantBookingEngineConfig[]) {

    let subs = bookingEngineConfigs.map(b => {
      let opt = { headers: {'TenantId' : b.tenantId}, withCredentials: true};
      return this.httpService.get<any[]>('https://auth.thundertech.no/api/tenantcontroller/tenantendpoints', opt )
        .pipe(map(response => ({ tenantId: b.tenantId, data: response })));  
    });
    
    forkJoin(subs).subscribe(res => {
      res.forEach(workerNodes => {
        bookingEngineConfigs.filter(o => o.tenantId == workerNodes.tenantId)[0].workerNodes = workerNodes.data;
      });

      this.moduleSubject.next(bookingEngineConfigs);
    });

    return this.moduleSubject.asObservable();
  }


}

//this.bookingEngineConfigs.filter(o => o.tenantId == res)
      //this.workerNodes = res[0];
      //this.moduleSubject.next(true);
