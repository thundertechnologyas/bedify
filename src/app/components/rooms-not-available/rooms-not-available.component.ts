import { Component } from '@angular/core';
import { BedifyBookingService } from '../../../services/bedify-booking.service';

@Component({
  selector: 'app-rooms-not-available',
  templateUrl: './rooms-not-available.component.html',
  styleUrl: './rooms-not-available.component.scss'
})
export class RoomsNotAvailableComponent {

  constructor(private bedifyService: BedifyBookingService) {

  }

  get available() {

    let found = 0;
    let available =  {...this.bedifyService.group.maxAvailableRentalObjects} as any;
    
    this.bedifyService.group.rooms.forEach(roomConfig => {
      roomConfig.rooms.forEach(room => {
        if (room.availableVariations.length == 0) {
          return;
        }

        if (available[room.rentalObjectId] && available[room.rentalObjectId] > 0) {
          available[room.rentalObjectId] = available[room.rentalObjectId] - 1;
          found++;
          return;
        }
      });
    });

    return found;
  }

}
