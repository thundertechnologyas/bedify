import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlService } from './url.service';
import { BookingEngine, BookingStartPaymentRequest, GroupBooking } from '../services/bedify-classes';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public loaded = false;

  public bookingEngine!: BookingEngine;
  defaultCheckin: any;

  init(tenantId: any, bookingEngineId: string) {
    /*
    
      */

  }

  public tenant: any;

  constructor(
    public bookingController: ExternalBookingController,
    public tenantController: TenantController
  ) {

  }
}

@Injectable({
  providedIn: 'root'
})
export class ExternalBookingController {
  httpService: HttpClient;
  urlService: UrlService;


  public constructor(httpService: HttpClient, urlService: UrlService) {
    this.httpService = httpService; this.urlService = urlService;
  }

  public create(arg0: GroupBooking): Observable<GroupBooking> {
    let headersWihtoutCredentials = new HttpHeaders().set('Content-type', 'application/json').set("TenantId", this.urlService.getCurrentTenantId() || "");
    let headers = { headers: headersWihtoutCredentials, withCredentials: true};
    return this.httpService.post<GroupBooking>(this.urlService.getBackendUrl() + '/bedify/booking/create', arg0, headers );
  }

  public getAvailability(arg0: GroupBooking): Observable<GroupBooking> {
    let headersWihtoutCredentials = new HttpHeaders().set('Content-type', 'application/json').set("TenantId", this.urlService.getCurrentTenantId() || "");
    let headers = { headers: headersWihtoutCredentials, withCredentials: true};
    return this.httpService.post<GroupBooking>(this.urlService.getBackendUrl() + '/bedify/booking/availability', arg0, headers );
  }

  public getCheckinOutTime(): Observable<any> {
    let headersWihtoutCredentials = new HttpHeaders().set('Content-type', 'application/json').set("TenantId", this.urlService.getCurrentTenantId() || "");
    let headers = { headers: headersWihtoutCredentials, withCredentials: true};
    return this.httpService.post<Date>(this.urlService.getBackendUrl() + '/bedify/booking/timeonserver', null, headers );
  }

  public getBookingEngine(arg0: string): Observable<BookingEngine> {
    let headersWihtoutCredentials = new HttpHeaders().set('Content-type', 'application/json').set("TenantId", this.urlService.getCurrentTenantId() || "");
    let headers = { headers: headersWihtoutCredentials, withCredentials: true};
    return this.httpService.get<BookingEngine>(this.urlService.getBackendUrl() + '/bedify/booking/bookingenginesettings?bookingEngineId=' + arg0, headers);
  }

  public getGroupBySessionId(arg0: string): Observable<GroupBooking> {
    let headersWihtoutCredentials = new HttpHeaders().set('Content-type', 'application/json').set("TenantId", this.urlService.getCurrentTenantId() || "");
    let headers = { headers: headersWihtoutCredentials, withCredentials: true};
    return this.httpService.get<GroupBooking>(this.urlService.getBackendUrl() + '/bedify/booking/bysessionid?sessionId=' + arg0, headers);
  }

  public validateDiscountCode(code: string, start: any, end: any): Observable<any> {
    let headersWihtoutCredentials = new HttpHeaders().set('Content-type', 'application/json').set("TenantId", this.urlService.getCurrentTenantId() || "");
    let headers = { headers: headersWihtoutCredentials, withCredentials: true};
    return this.httpService.get<any>(this.urlService.getBackendUrl() + '/bedify/booking/validatediscountcount?code=' + code + "&start=" + start.toDateString() + "&end=" + end.toDateString(),  headers );
  }

  public startPayment(request: BookingStartPaymentRequest): Observable<any> {
    let headersWihtoutCredentials = new HttpHeaders().set('Content-type', 'application/json').set("TenantId", this.urlService.getCurrentTenantId() || "");
    let headers = { headers: headersWihtoutCredentials, withCredentials: true};
    return this.httpService.post<GroupBooking>(this.urlService.getBackendUrl() + '/bedify/booking/startpayment', request,  headers );
  }

  public remotePaymentCompleted(remotePaymentId: string): Observable<void> {
    let headersWihtoutCredentials = new HttpHeaders().set('Content-type', 'application/json').set("TenantId", this.urlService.getCurrentTenantId() || "");
    let headers = { headers: headersWihtoutCredentials, withCredentials: true};
    return this.httpService.get<void>(this.urlService.getBackendUrl() + '/bedify/booking/paymentcompleted?remotePaymentId=' + remotePaymentId,  headers );
  }

}

@Injectable({
  providedIn: 'root'
})
export class TenantController {
  httpService: HttpClient;
  urlService: UrlService;

  public constructor(httpService: HttpClient, urlService: UrlService) {
    this.httpService = httpService; this.urlService = urlService;
  }

  public get(tenantId: String): Observable<any> {

    let headers = new HttpHeaders().set('Content-type', 'application/json');
    return this.httpService.get(this.urlService.getBackendUrl() + '/bedify/tenant/' + tenantId, { headers });
  }
}
