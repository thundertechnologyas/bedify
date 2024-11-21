import { Injectable, isDevMode } from '@angular/core';
import { BehaviorSubject, forkJoin, map, Observable } from 'rxjs';
import { BookingEngine, TenantBookingEngineConfig, GroupBooking, GuestInfo, HeaderFilter, Room, RoomConfig, RoomVariation, GroupLoadedEvent } from './bedify-classes';
import { ExternalBookingController } from '../controllers/api.service';

@Injectable({
  providedIn: 'root'
})
export class BedifyBookingService {
  
  public paymentSuccess: boolean = true;
  public successUrl: string = "";
  public failedUrl: string = "";
  
  setGroupComment(res: string | null) {
    this.group.comment = res || "";
    sessionStorage.setItem("groupcomment", this.group.comment);
  }
  
  tenant: any;
  defaultCheckin: any;
  bookingEngineConfigs : TenantBookingEngineConfig[] | null = null;
  group: GroupBooking = new GroupBooking();
  
  constructor(private bookingEngineController: ExternalBookingController) {
    this.loadFilterFromSessionStorage();
  }

  public headerFilter = new HeaderFilter();

  public bookingEngine = new BookingEngine();
  
  private filterSubject = new BehaviorSubject<HeaderFilter>(this.headerFilter);

  private groupSubject = new BehaviorSubject<GroupLoadedEvent | boolean | null>(null);

  private headerSubject = new BehaviorSubject<HeaderFilter | null | boolean>(null);

  public headerSubjectNotEmit = new BehaviorSubject<HeaderFilter | null | boolean>(null);

  public headerChanged(checkin: string | null | undefined, 
    checkout: string | null | undefined, 
    discountCode: string | null | undefined,
    bookingEngineId: string | null | undefined
  ) {
    this.setSessionItem("checkin", checkin);
    this.setSessionItem("checkout", checkout);
    this.setSessionItem("discountCode", discountCode);
    this.setSessionItem("bookingEngineId", bookingEngineId);

    // We need to remove the discount code if we change booking engine as the discount code 
    // might not be valid on a different tenant.
    if (this.headerFilter.bookingEngineId != bookingEngineId || !discountCode) {
      this.removeDiscountCode();
    }

    this.loadFilterFromSessionStorage()
    this.filterSubject.next(this.headerFilter);
    this.loadAvailability();
    this.headerSubject.next(this.headerFilter);
  }

  public onHeaderChanged() {
    return this.headerSubject.asObservable();
  }

  private removeDiscountCode() {
    sessionStorage.removeItem("discountCode");
    this.headerFilter.discountCode = null;
  }

  private setSessionItem(key: string, item: string | null | undefined) {
    if (item) {
      sessionStorage.setItem(key, item);
    } else {
      sessionStorage.removeItem(key);
    }
  }

  private loadFilterFromSessionStorage() {
    if (sessionStorage.getItem("checkin")) { this.headerFilter.checkin = new Date(sessionStorage.getItem("checkin") as any); }
    if (sessionStorage.getItem("checkout")) { this.headerFilter.checkout = new Date(sessionStorage.getItem("checkout") as any); }
    if (sessionStorage.getItem("discountCode")) { this.headerFilter.discountCode = sessionStorage.getItem("discountCode"); }
    if (sessionStorage.getItem("bookingEngineId")) { this.headerFilter.bookingEngineId = sessionStorage.getItem("bookingEngineId"); }
    if (sessionStorage.getItem("rooms")) { this.headerFilter.rooms = JSON.parse(sessionStorage.getItem("rooms") as string); }

    if (!this.headerFilter.rooms || !this.headerFilter.rooms.length) {
      let room = new RoomConfig();
      room.adults = 1;
      room.children = 0;

      let guestInfo = new GuestInfo();
      guestInfo.guestIndex = 1;
      room.guests.push(guestInfo);
      this.headerFilter.rooms.push(room);
    }

    if (sessionStorage.getItem("groupcomment")) { this.group.comment = sessionStorage.getItem("groupcomment") || ""; }
  }

  public onFilterChanged() : Observable<HeaderFilter> {
    return this.filterSubject.asObservable();
  }

  /**
   * Used to listen for changes in the booking, this happens
   * when header data is changed and new data has been loaded
   *  
   * ret: false = cant load due to invalid header data
   *      null = loading
   *      data = the group
   * 
   * @returns 
   */
  public onGroupLoaded() : Observable<GroupLoadedEvent | null | boolean> {
    return this.groupSubject.asObservable();
  }

  public roomsConfigChanged(rooms : RoomConfig[]) {
    this.group.rooms = [];
    this.group.hotelCollect = false;

    sessionStorage.setItem("rooms", JSON.stringify(rooms));
    
    this.loadFilterFromSessionStorage();
    this.filterSubject.next(this.headerFilter);
    this.loadAvailability();
  }

  private loadAvailability(first=false) {
    let group = new GroupBooking();

    if (first && !this.headerFilterValid) {
      this.loadDefaultHeader(); 
    }

    group.bookingEngineId = sessionStorage.getItem("bookingEngineId") || "";
    group.checkin = this.headerFilter.checkin ;
    group.checkout = this.headerFilter.checkout ;
    group.rooms = this.headerFilter.rooms;
    group.bookingCode = this.headerFilter.discountCode || "";


    if (group.rooms.length == 0) {
      let room = new RoomConfig();
      room.adults = 1;
      room.children = 0;
      group.rooms.push(room);
    }

    if (!this.headerFilterValid) {
      this.groupSubject.next(false);  
    } else {
      this.groupSubject.next(null);

      this.bookingEngineController.getAvailability(group).subscribe(res => {
        let groupLoadedEvent = new GroupLoadedEvent();
        groupLoadedEvent.group = this.group;
        groupLoadedEvent.loadedFromSession = false;

        if (first) {
          groupLoadedEvent.paymentSuccess = window.location.href.includes("paymentstatus=success");
          groupLoadedEvent.paymentFailed = window.location.href.includes("paymentstatus=failed");
        }
        
        this.group = res;
        this.groupSubject.next(groupLoadedEvent);
      });  
    }
  }

  loadDefaultHeader() {
    let config = this.getBookingEngineConfig();

    if (config != null && config.checkinOutTime != null) {
      this.headerFilter.checkin = new Date(config.checkinOutTime.checkinDate as any);
    }
    
    this.headerFilter.checkout = new Date(config?.checkinOutTime?.checkoutDate as any);
    this.headerFilter.bookingEngineId = config?.bookingEngineId;
    this.headerSubjectNotEmit.next(this.headerFilter);
    console.log(this.headerFilter);
  }

  private get headerFilterValid() {
    return this.headerFilter.checkin && this.headerFilter.checkin && sessionStorage.getItem("bookingEngineId");
  }

  public goToStart() {
    this.loadAvailability();
  }

  public getGroup() : GroupBooking {
    return this.group;
  } 

  public bedifyInitialized() {

    if (window.location.href.includes("paymentstatus=success")) {
      sessionStorage.removeItem("bedify_booking_session_id");
    }

    let oldSession = sessionStorage.getItem("bedify_booking_session_id");

    if (oldSession != null && oldSession) {
      this.bookingEngineController.getGroupBySessionId(oldSession).subscribe(res => {
        if (res) {
          this.loadAlreadyStartedBooking(res);
        } else {
          sessionStorage.removeItem("bedify_booking_session_id");
          this.loadAvailability(true);
        }
      });
    } else {
      this.loadAvailability(true);
    }
  }

  private loadAlreadyStartedBooking(res: GroupBooking) {
    this.group = res;
    this.headerFilter = new HeaderFilter();
    this.headerFilter.checkin = this.group.checkin;
    this.headerFilter.checkout = this.group.checkout;
    this.headerFilter.discountCode = this.group.bookingCode;
    this.headerFilter.bookingEngineId = this.group.bookingEngineId;

    let groupLoadedEvent = new GroupLoadedEvent();
    groupLoadedEvent.group = this.group;
    groupLoadedEvent.loadedFromSession = true;
    groupLoadedEvent.paymentSuccess = window.location.href.includes("paymentstatus=success");
    groupLoadedEvent.paymentFailed = window.location.href.includes("paymentstatus=failed");
    
    this.groupSubject.next(groupLoadedEvent);
  }

  getBookingEngineConfig() : TenantBookingEngineConfig | undefined {
    let bookingEngineId = sessionStorage.getItem("bookingEngineId");

    return this.bookingEngineConfigs?.filter(o => o.bookingEngineId == bookingEngineId)[0];
  }

  selectRoom(room: Room, variation: RoomVariation, roomConfig: RoomConfig) {
  
    this.group.rooms.filter(o => o.roomIndex == roomConfig.roomIndex).forEach(r => {
      r.selectedRentalObjectId = room.rentalObjectId;
      
      r.rooms.filter(o => o.rentalObjectId == room.rentalObjectId).forEach(a => {
        a.selectedVariation = variation.variationId;
        a.selectedOptionAddons = room.selectedOptionAddons;
        console.log(room.selectedOptionAddons);
      });

      let arr = this.group.maxAvailableRentalObjects as any;
      arr[r.selectedRentalObjectId] = arr[r.selectedRentalObjectId] - 1;
      this.group.maxAvailableRentalObjects = arr;
    });

  }
  
  startNewBooking() {
    this.loadAvailability();
  }
  
  get currency() : string {
    let currenctBookingEngine = this.getBookingEngineConfig();

    if (!currenctBookingEngine) {
      return "NOK";
    }

    if (!currenctBookingEngine.bookingEngine) {
      return "NOK";
    }

    return currenctBookingEngine.bookingEngine.currency.toUpperCase();
  }

  bookingSessionStarted(sessionId: string) {
    sessionStorage.setItem("bedify_booking_session_id", sessionId);
  }
 
  setUrl(successurl: string, failedurl: string) {
    this.successUrl = successurl;
    this.failedUrl = failedurl;
  }

  public getImageEndpoint(imageUuid: string) {
    
    let config = this.getBookingEngineConfig();

    if (config == null) {
      return "";
    }

    if (isDevMode()) {
      return "http://localhost:20003/commerce/productcontroller/image?uuid="+imageUuid+"&tenantId=" + config.tenantId;
    }

    return "https://"+config.workerNodes.filter(o => o.appModuleId == "6162ab1ca79bee36c683968b")[0].endPoint + "/commerce/productcontroller/image?uuid="+imageUuid+"&tenantId=" + config.tenantId; 
  }
}