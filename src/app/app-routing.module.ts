import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { FrontComponent } from './components/front/front.component';
import { BedifyBookingService } from '../services/bedify-booking.service';

const routes: Routes = [
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
