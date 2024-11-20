import { Component } from '@angular/core';
import { BedifyBookingService } from '../../../services/bedify-booking.service';
import { Room } from '../../../services/bedify-classes';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {
  public group: any;

  constructor(public dataService: BedifyBookingService) {
    this.group = this.dataService.getGroup();
  }

  getSelectedRoom(room: any) {
    for (let r of room.rooms) {
      if (r.rentalObjectId == room.selectedRentalObjectId) {
        return r;
      }
    }

    return null;
  }

  getSelectedVariation(room: Room) {
    for (let a of room.availableVariations) {
      if (a.variationId == room.selectedVariation) {
        return a;
      }
    }

    return null;
  }

  getTotal() {
    let total = 0;

    for (let room of this.group.rooms) {
      let selectedRoom = this.getSelectedRoom(room);
      let variation = this.getSelectedVariation(selectedRoom);
      
      if (variation != null) {
        total += variation.totalPrice;
      }
      
    }

    return total;
  }
}
