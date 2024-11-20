import { Component } from '@angular/core';
import { BedifyBookingService } from '../../../services/bedify-booking.service';

@Component({
  selector: 'app-terms-and-condition-dialog',
  templateUrl: './terms-and-condition-dialog.component.html',
  styleUrl: './terms-and-condition-dialog.component.scss'
})
export class TermsAndConditionDialogComponent {
  public terms: string = "";

  constructor(private dataService: BedifyBookingService) {
    let bookingEngine = this.dataService.getBookingEngineConfig();
  
      if (bookingEngine && bookingEngine.bookingEngine != null) {
        this.terms = bookingEngine.bookingEngine.termsAndConditions;    
      }
  
      
  }
}
