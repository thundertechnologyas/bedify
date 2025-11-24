import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { FrontComponent } from './components/front/front.component';
import { BedifyBookingService } from '../services/bedify-booking.service';
import { GuestPortalComponent } from './components/guest-portal/guest-portal.component';
import { GuestPortalFrontComponent } from './components/guest-portal-front/guest-portal-front.component';

const routes: Routes = [
  {
    path: ':tenantId/guestportal/:token',
    component: GuestPortalFrontComponent
  },
  {
    path: ':tenantId/:bookingEngineId',
    component: FrontComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
