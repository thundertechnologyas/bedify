import { Component, ElementRef, ViewChild } from '@angular/core';
import { BedifyBookingService } from '../../../services/bedify-booking.service';
import { BedifyProgressService } from '../../../services/bedify-progress.service';

@Component({
  selector: 'app-bedify-content',
  templateUrl: './bedify-content.component.html',
  styleUrl: './bedify-content.component.scss'
})
export class BedifyContentComponent {
  public loading = false;
  private lastSetLoadingTime: number = 0;


  @ViewChild('topOfComponent') 
  private topOfComponent! : ElementRef;

  constructor(
    public bedifyService: BedifyBookingService,
    public bedifyProgressService: BedifyProgressService
  ) {


    bedifyProgressService.onStep().subscribe(res => {
      if (this.topOfComponent) {
        this.topOfComponent.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    bedifyService.onFilterChanged().subscribe(() => {
      this.loading = true;
      this.lastSetLoadingTime = Date.now();
    });

    bedifyService.onGroupLoaded().subscribe(() => {
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
}
