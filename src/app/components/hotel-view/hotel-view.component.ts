import { Component, Input, isDevMode } from '@angular/core';
import { GroupBooking } from '../../../services/bedify-classes';
import { BedifyBookingService } from '../../../services/bedify-booking.service';

@Component({
  selector: 'app-hotel-view',
  templateUrl: './hotel-view.component.html',
  styleUrl: './hotel-view.component.scss'
})
export class HotelViewComponent {
  @Input("group")
  public group: GroupBooking | null = null;

  constructor(private dataService: BedifyBookingService) {

  }

  get images() : string[] {
  
    if (this.group) {
      return this.group.images;
    }

    return [];
  }

  getImageEndpoint() {
      if (isDevMode()) {
        return "http://localhost:20003";
      } else {
        if (this.bookingEngine) {
          return this.bookingEngine.tenant.commerceEndpoint;
        }
        return "";
      }
  }

  get bookingEngine() {
    let ret = null;
    
    if (this.group != null) {
      ret = this.dataService.getBookingEngine(this.group.bookingEngineId);
    }

    return ret;
  }

  get minPrice() {
    let ret = 0;

    let usedRooms = {} as any;

    if (this.group) {
      this.group?.rooms.forEach(roomConfig => {
        let minPrice = 99999999999;
        
        let selecteProductId = "";
        for (let room of roomConfig.rooms) {

          let maxRooms = 0 as any;

          if (this.group && this.group.maxAvailableRentalObjects) {
            let map = this.group.maxAvailableRentalObjects as any;
            maxRooms = map[room.rentalObjectId];
          }

          if (!maxRooms) {
            maxRooms = 0;
          }

          let roomsUsed = 0;

          if (usedRooms[room.rentalObjectId]) {
            roomsUsed = usedRooms[room.rentalObjectId];
          }

          for (let variation of room.availableVariations) {
            
            if (variation.totalPrice < minPrice && maxRooms > roomsUsed) {
              minPrice = variation.totalPrice;
              selecteProductId = room.rentalObjectId;
            }
            
          }
        }

        ret += minPrice;
        
        if (!usedRooms[selecteProductId]) {
          usedRooms[selecteProductId] = 0;
        }

        usedRooms[selecteProductId] = usedRooms[selecteProductId] + 1;
        
      })
    }
    
    console.log(usedRooms);
    return ret;
  }

  get currency() {
    let engineConfig = this.bookingEngine;
    if (engineConfig && engineConfig.bookingEngine && engineConfig.bookingEngine.currency) {
      return engineConfig.bookingEngine.currency.toUpperCase();
    }

    return "NOK";
  }

  get maxNumberOfRooms() {
    if (!this.group) {
      return 0;
    }

    return this.group.totalAvailableRooms;
  }

  get isBookable() {
    
    if (!this.group) {
      return false;
    }

    return this.group.rooms.length > 0 && this.group.rooms.length <= this.maxNumberOfRooms;
  }

  bookNow() {
    if (this.group != null) {
      this.dataService.bookGroup(this.group);
    }
  }
  
  get restrictionReasons() {
    if (this.group) {
      return [...new Set([...this.group.rooms.filter(o => o.restrictionReason).map(o => o.restrictionReason)])];
    }

    return []
    
  }
}
