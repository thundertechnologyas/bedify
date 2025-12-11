import { AfterViewInit, Component, Input, isDevMode, OnDestroy, ViewChild } from '@angular/core';
import { Room, RoomConfig } from '../../../services/bedify-classes';
import { BedifyBookingService } from '../../../services/bedify-booking.service';
import { FormControl } from '@angular/forms';
import { BedifyProgressService } from '../../../services/bedify-progress.service';
import { MatDialog } from '@angular/material/dialog';
import { AdditionalAddonDialogComponent } from '../additional-addon-dialog/additional-addon-dialog.component';

@Component({
  selector: 'app-room-config',
  templateUrl: './room-config.component.html',
  styleUrls: ['./room-config.component.scss']
})
export class RoomConfigComponent implements AfterViewInit {
  
  @Input()
  public roomConfig! : RoomConfig | null;

  public variationSelect = new Map<string, FormControl>();

  constructor(public dataService: BedifyBookingService, 
    private dialog: MatDialog,
    private bedifyProgressService: BedifyProgressService) {

  }
  
  ngAfterViewInit(): void {
    
  }

  hasImages(room: Room) {
    
    if (room.images == null) {
      return false;
    }

    return room.images.length > 0;
  }

  getImageEndpoint() {
    
    if (isDevMode()) {
      return "http://localhost:20003";
    } else {
      return this.dataService.getBookingEngineConfig()?.tenant.commerceEndpoint;
    }
  }

  roomsLeft(room: Room) {
    if (!this.dataService.group) {
      return;
    }

    let maxAvailables = this.dataService.group.maxAvailableRentalObjects as any;

    return maxAvailables[room.rentalObjectId];
  }

  isAvailable(room: Room) {
    return this.roomsLeft(room) > 0;
  }

  getFormControl(room: Room) {
    let control = this.variationSelect.get(room.rentalObjectId);

    if (control == null) {
      control = new FormControl();
      control.patchValue(room.availableVariations[0].variationId);
      this.variationSelect.set(room.rentalObjectId, control);
    }

    return control;
  }

  getSelectedPrice(room: Room) {
    let variationId = this.getFormControl(room).value;
    return room.availableVariations.filter(a => a.variationId == variationId)[0].totalPrice;
  }

  select(room: Room) {
    let variationId = this.getFormControl(room).value;
    let variation = room.availableVariations.filter(a => a.variationId == variationId)[0];
    
    if (variation.optionalAddons && variation.optionalAddons.length) {
      let ref = this.dialog.open(AdditionalAddonDialogComponent);
      ref.componentInstance.optionalAddons = variation.optionalAddons;

      ref.afterClosed().subscribe(addons => {
        
        if (addons == undefined) {
          return;
        }

        if (addons) {
          room.selectedOptionAddons = addons;
        } else {
          room.selectedOptionAddons = [];
        }
    
        if (this.roomConfig) {
          this.dataService.selectRoom(room, variation, this.roomConfig);  
          this.bedifyProgressService.next();
        }
      });

      return;
    }

    if (this.roomConfig) {
      this.dataService.selectRoom(room, variation, this.roomConfig);
    }
    
    this.bedifyProgressService.next();
  }

  replaceNbsps(str: any) {
      return str.replace(/&nbsp;/g, ' ');
  }
}
