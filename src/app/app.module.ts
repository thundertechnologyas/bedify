import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HeaderComponent } from './components/header/header.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RoomComponent } from './components/room/room.component';
import { RoomConfigComponent } from './components/room-config/room-config.component';
import { PhotoGalleryModule } from '@twogate/ngx-photo-gallery';
import { DiscountCodeDialogComponent } from './components/discount-code-dialog/discount-code-dialog.component';
import { LastPageComponent } from './components/last-page/last-page.component';
import { GuestInfosComponent } from './components/last-page/guest-infos/guest-infos.component';
import { GuestInfoComponent } from './components/last-page/guest-info/guest-info.component';
import { CompanyInformationComponent } from './components/last-page/company-information/company-information.component';
import { BedifyBookingHeader } from './components/bedify-booking-header/bedify-booking-header.component';
import { SummaryComponent } from './components/summary/summary.component';
import { RoomSelectorComponent } from './components/room-selector/room-selector.component';
import { BedifyContentComponent } from './components/bedify-content/bedify-content.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { PaymentStatusComponent } from './components/payment-status/payment-status.component';
import { RoomsNotAvailableComponent } from './components/rooms-not-available/rooms-not-available.component';
import { FrontComponent } from './components/front/front.component';
import { registerLocaleData } from '@angular/common';

import localNo from '@angular/common/locales/nb';
import localFi from '@angular/common/locales/fi';
import localDe from '@angular/common/locales/de';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TermsAndConditionDialogComponent } from './components/terms-and-condition-dialog/terms-and-condition-dialog.component';
import { AdditionalAddonDialogComponent } from './components/additional-addon-dialog/additional-addon-dialog.component';
import { AddtionalProductViewComponent } from './components/additional-addon-dialog/addtional-product-view/addtional-product-view.component';
import { GuestPortalComponent } from './components/guest-portal/guest-portal.component';
import { GuestPortalFrontComponent } from './components/guest-portal-front/guest-portal-front.component';
import { PulseOpenStatusComponent } from './components/pulse-open-status/pulse-open-status.component';

registerLocaleData(localNo);
registerLocaleData(localFi);
registerLocaleData(localDe);

const initLocaleProvider = {
  provide: LOCALE_ID,
  useValue: 'nb'
};

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RoomComponent,
    RoomConfigComponent,
    LastPageComponent,
    GuestInfosComponent,
    GuestInfoComponent,
    CompanyInformationComponent,
    BedifyBookingHeader,
    SummaryComponent,
    DiscountCodeDialogComponent,
    RoomSelectorComponent,
    BedifyContentComponent,
    ProgressBarComponent,
    PaymentStatusComponent,
    RoomsNotAvailableComponent,
    FrontComponent,
    LanguageSelectorComponent,
    TermsAndConditionDialogComponent,
    AdditionalAddonDialogComponent,
    AddtionalProductViewComponent,
    GuestPortalComponent,
    GuestPortalFrontComponent,
    PulseOpenStatusComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatIconModule,
    MatRadioModule,
    MatSlideToggleModule,
    PhotoGalleryModule,
    MatDialogModule,
    HttpClientModule,
    FormsModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    TranslateModule.forRoot(
      {
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }
    )
  ],
  providers: [initLocaleProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
