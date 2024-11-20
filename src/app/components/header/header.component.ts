import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor() {


  }

  get logo() {
    return "https://auth.thundertech.no/api/tenantcontroller/logo?tenantId="; // TODO; + this.apiService.tenant.id;
  }
}
