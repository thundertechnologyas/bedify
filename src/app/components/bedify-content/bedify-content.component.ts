import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { BedifyBookingService } from '../../../services/bedify-booking.service';
import { BedifyProgressService } from '../../../services/bedify-progress.service';
import { GroupBooking, GroupLoadedEvent } from '../../../services/bedify-classes';

@Component({
  selector: 'app-bedify-content',
  templateUrl: './bedify-content.component.html',
  styleUrl: './bedify-content.component.scss'
})
export class BedifyContentComponent implements AfterViewChecked {
  public loading = false;
  private lastSetLoadingTime: number = 0;

  public multiproperty = false;

  @ViewChild('topOfComponent') 
  private topOfComponent! : ElementRef;
  
  public groups: GroupBooking[] = [];

  constructor(
    public bedifyService: BedifyBookingService,
    public bedifyProgressService: BedifyProgressService,
    private cdr: ChangeDetectorRef
  ) {

    bedifyService.onFilterChanged().subscribe(() => {
      this.loading = true;
      this.lastSetLoadingTime = Date.now();
    });

    bedifyService.onMultipropertyLoaded().subscribe(groups => {
      this.multiproperty = true;
      this.groups = groups;
      this.loading = false;
    });

    bedifyService.onGroupLoaded().subscribe(res => {
      if (res == null) {
        this.loading = true;
        return;
      }
      
      this.multiproperty = false;
      const currentTime = Date.now();
      if (currentTime - this.lastSetLoadingTime >= 400) {
        this.loading = false;
      } else {
        setTimeout(() => {
          this.loading = false;
        }, 1000 - (currentTime - this.lastSetLoadingTime));
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.bedifyProgressService.loadingRoomInfo) {
      let top = this.topOfComponent.nativeElement.getBoundingClientRect().top;
      window.scrollBy(0,top);
    }
  }


}
