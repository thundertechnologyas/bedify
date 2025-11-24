import { Component } from '@angular/core';
import { ApiService } from '../../../controllers/api.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pulse-open-status',
  templateUrl: './pulse-open-status.component.html',
  styleUrl: './pulse-open-status.component.scss'
})
export class PulseOpenStatusComponent {
 
  public token = "";
  public requestid = "";
  public lockid = "";

  public success = false;


  constructor(private apiService: ApiService, private dialogRef: MatDialogRef<PulseOpenStatusComponent>) {
    
  }

  startPulseOpen() {
    this.apiService.guestPortalController.pulseOpen(this.token, this.lockid).subscribe(res => {
      this.requestid = res.requestId;
      setTimeout(() => this.checkStatus(), 1000);
    });
  }

  checkStatus() {
    this.apiService.guestPortalController.getPulseOpenStatus(this.token, this.requestid).subscribe(res => {
      
      if (res.state != "success") {
        setTimeout(() => this.checkStatus(), 1000);
      } else {
        this.showSuccess();
      }
    })
  }

  showSuccess() {
    this.success = true;
    setTimeout(() => this.dialogRef.close(true), 2000);
  }
}
