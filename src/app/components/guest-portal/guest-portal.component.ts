import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BedifyBookingService } from '../../../services/bedify-booking.service';
import { ApiService } from '../../../controllers/api.service';
import { MatDialog } from '@angular/material/dialog';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { TranslationService } from '../../../services/translation.service';
import data from '../../../assets/data/availableLangs.json';
import { PulseOpenStatusComponent } from '../pulse-open-status/pulse-open-status.component';

@Component({
  selector: 'app-guest-portal',
  templateUrl: './guest-portal.component.html',
  styleUrl: './guest-portal.component.scss'
})
export class GuestPortalComponent {
  public token = "";
  public portal: any;

  @Input("defaultlang")
  public _selectedLang = "en";
  
  @Input("multilanguage")
  public multiLanguage = true;

  public availableLangs = data;
    

  constructor(route: ActivatedRoute, private apiService: ApiService, 
    private dialog: MatDialog, 
    private translationService: TranslationService ) {
    this.token = route.snapshot.params['token'];
    
    this.apiService.guestPortalController.get(this.token).subscribe(res => {
      this.portal = res;
    })
  }

  selectLanguage() {
      let ref = this.dialog.open(LanguageSelectorComponent);
      ref.afterClosed().subscribe(res => {
        if (res) {
          this.translationService.changeLang(res.code.toLowerCase());
          this._selectedLang = res.code;
          sessionStorage.setItem("bedify_booking_selected_lang", res.code.toLowerCase());
        }
      })
  }
  
  get selectedLang() {
    return this.availableLangs.filter(o => o.code == this._selectedLang.toUpperCase())[0];
  }

  pulseOpen(lock: any) {
    
    if (!lock.allowPulseOpen) {
      return;
    }

    let ref = this.dialog.open(PulseOpenStatusComponent);
    ref.componentInstance.lockid = lock.id;
    ref.componentInstance.token = this.token;
    ref.componentInstance.startPulseOpen();
    

  }
}
