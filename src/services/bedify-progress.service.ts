import { Injectable } from '@angular/core';
import { BedifyBookingService } from './bedify-booking.service';
import { RoomConfig } from './bedify-classes';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BedifyProgressService {
  
  public currentRoom!: RoomConfig | null;

  /**
   * We simulate that we load room info so that
   * the user experience that we actually change 
   * between rooms.
   */
  public loadingRoomInfo: boolean = false;
  public loadingBack: boolean = false;
  
  public step: string = "configrooms";

  public nextSubject = new BehaviorSubject<string>("");
  
  next() {

    if (this.currentRoom && (this.currentRoom.roomIndex+1) == this.bedifyService.group.rooms.length) {
      this.loadingRoomInfo = true;

      setTimeout(() => {
        this.step = "customerinfo";
        this.currentRoom = null;
        this.loadingRoomInfo = false;
      }, 1000);

      this.setStep();
      
      return;
    }

    this.loadingRoomInfo = true;
    
    setTimeout(() => {
      this.loadingRoomInfo = false; 
      this.loadNextRoom();
      this.setStep();
    }, 1000);
    
  }

  setStep() {
    const url = new URL(window.location.href);
    url.searchParams.set("step", this.step);
    
    if (this.currentRoom == null) {
      url.searchParams.set("currentroom", "none");
    } else {
      url.searchParams.set("currentroom", ""+this.currentRoom.roomIndex);
    }
    
    history.pushState(null, "", url.toString());
    this.nextSubject.next(this.step);
  }

  public onNext() {
    return this.nextSubject.asObservable();
  }  

  public goToCustomerInfo() {
    this.currentRoom = null;
    this.step = "customerinfo";
    this.setStep();
  }

  loadNextRoom() {
    let found = false;
    let oldRoom = this.currentRoom;
    this.currentRoom = null;
    
    this.bedifyService.group.rooms.forEach(r => {
      
      if (r.roomIndex == oldRoom?.roomIndex) {
        found = true;
        return;
      }

      if (found && this.currentRoom == null) {
        this.currentRoom = r;
      }
    })
  }

  constructor(private bedifyService: BedifyBookingService) { 
    this.bedifyService.onGroupLoaded().subscribe(loadedEvent => {
      let event = loadedEvent as any;

      if (!event) {
        return;
      }

      if (event.group && !event.loadedFromSession) {
        this.step = "configrooms";
        this.currentRoom = this.bedifyService.group.rooms[0];
        this.setStep();
      }

      if (event.group && !this.allRoomsAvailable) {
        this.step = "roomsnotavailable";
        this.currentRoom = null;
        this.setStep();
      }

      if (event.group && event.loadedFromSession) {
        this.step = "customerinfo";
        this.currentRoom = null;
        this.setStep();
      }

      if (event.paymentFailed || event.paymentSuccess) {
        this.step = "reservationcompleted";
        this.currentRoom = null;
        this.bedifyService.paymentSuccess = event.paymentSuccess;
        this.setStep();
      }
    });

    this.bedifyService.onHeaderChanged().subscribe(res => {
      this.step = "configrooms";
    });

    window.addEventListener("popstate", (event) => {
      const url = new URL(window.location.href);
      const step = url.searchParams.get("step");
      const currentroom = url.searchParams.get("currentroom");
      
      if (step) {
        this.step = step;
      }
      
      if (!currentroom || currentroom == "none") {
        this.currentRoom = null;
      } else {
        this.currentRoom = null;
        this.loadingBack = true;
        this.loadingRoomInfo = true;
        setTimeout(() => {
          this.currentRoom = this.bedifyService.group.rooms.filter(o => o.roomIndex == parseInt(currentroom, 10))[0];
          this.loadingRoomInfo = false;
          this.loadingBack = false;
        }, 1000);
        
      }
    });
  }

  get allRoomsAvailable() {

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

    return found >= this.bedifyService.group.rooms.length;
  }

  reservationCompleted() {
    this.step = "reservationcompleted";
    this.setStep();
  }
}
