import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BedifyBookingService } from '../../../services/bedify-booking.service';
import { ExternalBookingController } from '../../../controllers/api.service';

@Component({
  selector: 'app-discount-code-dialog',
  templateUrl: './discount-code-dialog.component.html',
  styleUrls: ['./discount-code-dialog.component.scss']
})
export class DiscountCodeDialogComponent {
  public code = "";

  bookingResponseCode: string = "";
  group: any;
  bookingCodeResponseMetaData: any;
  external = false;
  codeRemoved = false;

  constructor(private controller: ExternalBookingController, 
    private dialogRef: MatDialogRef<DiscountCodeDialogComponent>,
    private dataService: BedifyBookingService) {
    this.group = dataService.getGroup();
  }

  applyCode() {

    this.bookingResponseCode = "";

    this.controller.validateDiscountCode(
      this.code,
      new Date(this.group.checkin),
      new Date(this.group.checkout)
      ).subscribe(res => {
        if (res.responseCode == "ok") {
          this.dialogRef.close(this.code);
        } else {
          this.bookingResponseCode = res.responseCode;
          this.bookingCodeResponseMetaData = res.metaData;
        }
      });
  }

  diconnect() {
    this.dialogRef.close("");
  }
}
