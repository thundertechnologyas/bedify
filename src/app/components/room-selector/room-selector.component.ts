import { AfterViewInit, Component, QueryList, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RoomComponent } from '../room/room.component';
import { MatDialogRef } from '@angular/material/dialog';
import { BedifyBookingService } from '../../../services/bedify-booking.service';
import { GuestInfo, RoomConfig } from '../../../services/bedify-classes';

@Component({
  selector: 'app-room-selector',
  templateUrl: './room-selector.component.html',
  styleUrls: ['./room-selector.component.scss']
})
export class RoomSelectorComponent implements AfterViewInit {

  @ViewChildren('room')
  public roomsComponents!: QueryList<RoomComponent>;

  public numberOfRoomsControl = new FormControl();
  private MAX_NUMBER_OF_ROOMS = 30;

  constructor(public dataService: BedifyBookingService, 
    private dialogRef: MatDialogRef<RoomSelectorComponent>) {
    let rooms = dataService.group.rooms.length;
    if (rooms < 1) {
      rooms = 1;
    }
    this.numberOfRoomsControl.patchValue(rooms);
  }

  ngAfterViewInit(): void {
    this.dataService.group.rooms.forEach(room => {
      let toUpdate = this.roomsComponents.filter(o => (o.roomNumber - 1) == room.roomIndex)[0];
      toUpdate.adults = room.adults;
      toUpdate.children = room.children;
    });
  }

  get rooms() {
    return Array(this.MAX_NUMBER_OF_ROOMS).fill(0).map((x,i)=>i+1);
  }

  get numberOfRooms() {
    let num = this.numberOfRoomsControl.value;
    return Array(num).fill(0).map((x,i)=>i+1);
  }

  get adults() {
    if (!this.roomsComponents) {
      return 0;
    }

    let ret = 0;

    this.roomsComponents.forEach(room => {
      ret += room.adults;
    })

    return ret;
  }

  get children() {
    if (!this.roomsComponents) {
      return 0;
    }

    let ret = 0;

    this.roomsComponents.forEach(room => {
      ret += room.children;
    })

    return ret;
  }

  save() {

    let rooms = [];

    let i = 0;
    for (let a of this.roomsComponents) {
      let room = new RoomConfig();
      room.adults = a.adults;
      room.children = this.children;
      room.roomIndex = i;
  
      for (let i=0; i<a.adults; i++) {
        let g = new GuestInfo();
        g.guestIndex = (i + 1);
        room.guests.push(g);
      }
  
      for (let i=0; i<a.children; i++) {
        let g = new GuestInfo();
        g.child = true;
        g.guestIndex = a.adults + (i + 1);
        room.guests.push(g);
      }
  
      i++;
      
      rooms.push(room);
    }

    this.dataService.roomsConfigChanged(rooms);
    this.dialogRef.close();

    /*
    
    this.dataService.clearRooms();
    
    this.roomsComponents.forEach(room => {
      this.dataService.createRoom(room.adults, room.children);
    });

    this.dataService.fireGroupChanged();
    this.dialogRef.close();
    */
  }
}
