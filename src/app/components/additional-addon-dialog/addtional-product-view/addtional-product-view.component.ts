import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { BedifyBookingService } from '../../../../services/bedify-booking.service';

@Component({
  selector: 'app-addtional-product-view',
  templateUrl: './addtional-product-view.component.html',
  styleUrl: './addtional-product-view.component.scss'
})

export class AddtionalProductViewComponent {
  
  @Input("optionaladdon")
  public optionalAddon : any = null;

  @Output("change")
  public eventEmitter = new EventEmitter<any>();

  constructor(public dataService: BedifyBookingService) {

  }

  get hasImage() {
    
    if (this.optionalAddon.product.images.length > 0) {
      return true;
    }

    return false;
  }

  get image() {
    if (!this.hasImage) {
      return false;
    }

    return this.dataService.getImageEndpoint(this.optionalAddon.product.images[0].uuid);
  }

  selected(event: any) {
    this.eventEmitter.emit(event.checked);
  }

}
