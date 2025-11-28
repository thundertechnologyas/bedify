export class HeaderFilter {
    public checkin : Date | null | undefined = null;
    public checkout : Date | null | undefined  = null;
    public discountCode : string | null | undefined  = null;
    public bookingEngineId : string | null | undefined  = null;
    public rooms: RoomConfig[] = [];
}

export class BookingEngine {
    public id = "";
    public name = "";
    public paymentTypeIds : string[] = [];
    public guestJourneyId = "";
    public pricePlanId = "";
    public payLater = false;
    public theming : any = null;
    public maxNumberOfGuests = 2;
    public defaultPrefix = "";
    public currency = "";
    public termsAndConditions = "";
    public payPartial = false;
    public partialPaymentPercentage = 0;

    public hotelName = "";
    public hotelAddress = "";
    public hotelCity = "";
    public hotelPostCode = "";
    public hotelDescription = "";
}
  
export class GroupBooking {
    public id = "";
    public company = new Company();
    public checkin: Date | null | undefined = null;
    public checkout: Date | null | undefined = null;
    public dateSelected = false;
    public rooms: RoomConfig[] = [];
    public maxAvailableRentalObjects = new Map<string, number>();
    public source = "bookingengine";
    public bookingEngineId = "";
    public bookingCode = "";
    public companySelected = false;
    public hotelCollect = false;
    public comment: string = "";
    public payOnArrival = false;
    public sessionId = "";
    public totalAvailableRooms = 0;

    public images : string[] = [];

    constructor() { 
    }
}

export class BookingStartPaymentRequest {
    public groupId = "";
    public paymentTypeId = "";
    public paymentSuccessUrl = "";
    public paymentFailureUrl = "";
    public partial = false;
}

export class GroupLoadedEvent {
    public groups : GroupBooking[] | null = null;
    public group : GroupBooking | null = null;
    public loadedFromSession = false;
    public paymentFailed = false;
    public paymentSuccess = false;
}
  
export class Room {
    public rentalObjectId = "";
    public rentalObjectName = "";
    public rentalDescription = "";
    public availableVariations : RoomVariation[] = [];
    public facilities : string[] = [];
    public maxNumberOfAdults = 0;
    public maxNumberOfChildren = 0;
  
    public selectedVariation = "";
    public selectedOptionAddons : any[] = [];
    
    public images = [
      'https://www.gannett-cdn.com/-mm-/05b227ad5b8ad4e9dcb53af4f31d7fbdb7fa901b/c=0-64-2119-1259/local/-/media/USATODAY/USATODAY/2014/08/13/1407953244000-177513283.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXtIeDNBSuf-pZgI1FeUuNKj-XPPHo4ka_7w&usqp=CAU',
      'https://lh3.googleusercontent.com/yjDoBdvT5hee7GpGXk5fSi43sU0E_4_f2YeopUW99NJODjcMWAHbDWhkLO6KvjwTXvjQwlyRR0gQx2w2CnGfyohY8ETkGVzVwo-O5ti6uk8gaHecDEMA4w4yyiCAHepf29ZGXE8M'
    ];
}
  
export class RoomConfig {
    public roomIndex = 0;
    public adults: number = 0;
    public children: number = 0;
    public selectedRentalObjectId = "";
    public rooms: Room[] = [];
    public guests: GuestInfo[] = [];
    public restrictionReason = "";

    getSelectedRoom() {
        return this.rooms.filter(o => o.rentalObjectId == this.selectedRentalObjectId)[0];
    }
}
 
export class RoomVariation {
    public variationId = "123";
    public variationName = "Inkludert frokost";
    public totalPrice = 0;
    public optionalAddons : any[] = [];
}
  
export class GuestInfo {
    public guestIndex = 0;
    public child : boolean = false;
    public firstName : string = "";
    public lastName : string = "";
    public phonePrefix : string = "";
    public phoneNumber : string = "";
    public email : string = "";
    public childAge : number = 0;
    public prefix: number = 0;
}
  
export class Company {
    public activated = false;
    public name: string = "";
    public address: string = "";
    public city: string = "";
    public postNumber: string = "";
    public prefix: string = "";
    public phone: string = "";
    public email: string = "";
    public countrycode : string = "";
    public vatNumber : string = "";
}

export class DefaultCheckInOutDates {
    public checkinDate : Date | null = null;
    public checkoutDate : Date | null = null;
}

/**
 * A tenant can have multiple booking engines and the bookingengine can have multiple tenants.
 * 
 * After a Bookingengine has been initialized, this object will be populated with all the config
 * a BookingEngine can do from web interface. 
 * 
 * Use BedifyService to get the config object.
 */
export class TenantBookingEngineConfig {
    
    constructor(tenantId: string, bookingEngine: string) {
        this.tenantId = tenantId;
        this.bookingEngineId = bookingEngine;
    }

    public tenantId = "";
    public bookingEngineId = "";

    public tenant : any;
    public bookingEngine: BookingEngine | null= null;
    public checkinOutTime: DefaultCheckInOutDates | null = null;

    public workerNodes: any[] = [];
}