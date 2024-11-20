import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { GuestInfoComponent } from '../guest-info/guest-info.component';
import { BedifyBookingService } from '../../../../services/bedify-booking.service';
import { Room, RoomConfig } from '../../../../services/bedify-classes';

@Component({
  selector: 'app-guest-infos',
  templateUrl: './guest-infos.component.html',
  styleUrls: ['./guest-infos.component.scss']
})
export class GuestInfosComponent {

  @ViewChildren("guestinfo")
  private guestinfos!: QueryList<GuestInfoComponent>;

  public commentControl = new FormControl('');

  constructor(public dataService: BedifyBookingService) {
    this.commentControl.patchValue(this.dataService.getGroup().comment);
    this.commentControl.valueChanges.subscribe(res => {
      this.dataService.setGroupComment(res);
    });
  }

  getVariation(roomConfig: RoomConfig) {
    let selectedRoom  = this.getSelectedRoom(roomConfig);

    for (let a of selectedRoom.availableVariations) {
      if (selectedRoom.selectedVariation == a.variationId) {
        return a;
      }
    }

    return null;
  }

  getVariationName(roomConfig: RoomConfig) {
    /*
    let room = roomConfig.getSelectedRoom();

    if (room != null) {
      return this.dataService.getSelectedVariation(room)?.variationName;
    }

    TODO

    */ 
    return this.getVariation(roomConfig).variationName;
  }

  get valid() {
    if (!this.guestinfos) {
      return false;
    }

    return this.guestinfos.filter(o => !o.valid).length == 0;
  }

  getSelectedRoom(roomConfig: RoomConfig) : any {
    let configInstance: RoomConfig;
    
    if (roomConfig instanceof RoomConfig) {
        configInstance = roomConfig;
    } else {
        configInstance = new RoomConfig();
        Object.assign(configInstance, roomConfig);  // Copy properties if roomConfig is a plain object
    }

    return configInstance.getSelectedRoom();
  }
  
}
