import { Component } from '@angular/core';

@Component({
  selector: 'app-additional-addon-dialog',
  templateUrl: './additional-addon-dialog.component.html',
  styleUrl: './additional-addon-dialog.component.scss'
})
export class AdditionalAddonDialogComponent {
  
  public selectedAddons : any[] = [];
  
  public optionalAddons : any[] = [];

  public addonChanged(checked: boolean, optionalAddon: any) {
    
    this.selectedAddons = this.selectedAddons.filter(o => o != optionalAddon);

    if (checked) {
      this.selectedAddons.push(optionalAddon);
    }
  }


}
