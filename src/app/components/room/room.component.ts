import { Component, Input } from '@angular/core';
import { BedifyBookingService } from '../../../services/bedify-booking.service';
import { TenantBookingEngineConfig } from '../../../services/bedify-classes';


@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent {
  @Input("roomNumber")
  public roomNumber: number = 0;

  @Input("multiProperty")
  public multiProperty: boolean = false;

  public adults:number = 1;
  public children:number = 0;

  constructor(private dataService: BedifyBookingService) {

  }
  addChild() {
    this.children++;
  }

  subChild() {
    this.children--;

    if (this.children < 0) {
      this.children = 0;
    }
  }

  addAdults() {
    
    if (this.dataService.getMaxNumberOfAdults(this.multiProperty) <= this.adults) {
      return;
    }
    
    this.adults++;
  }

  subAdults() {
    this.adults--;
    if (this.adults < 1) {
      this.adults = 1;
    }
  }
}
