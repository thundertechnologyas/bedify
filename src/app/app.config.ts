import { ApplicationConfig, importProvidersFrom, isDevMode, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';

import { provideAnimations } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient, translate: TranslateService, translationService: TranslationService) {
  const loader = isDevMode()
    ? new TranslateHttpLoader(http, 'http://localhost:5000/assets/i18n/', '.json')
    : new TranslateHttpLoader(http, 'https://embedded.bedify.net/assets/i18n/', '.json');

  // Subscribe to translation load event
  loader.getTranslation('en').subscribe(() => {
    // Set default language after translation is loaded
    translate.setDefaultLang('en');
    translationService.changeLang('en');
    console.log("Loaded lang");
  });

  return loader;
  
}

import localNo from '@angular/common/locales/nb';
import localFi from '@angular/common/locales/fi';
import localDe from '@angular/common/locales/de';
import localSe from '@angular/common/locales/se';
import { BedifyBookingService } from '../services/bedify-booking.service';
import { TranslationService } from '../services/translation.service';

registerLocaleData(localNo);
registerLocaleData(localFi);
registerLocaleData(localDe);
registerLocaleData(localSe);

const initLocaleProvider = {
  provide: LOCALE_ID,
  useValue: 'nb'
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    importProvidersFrom(HttpClientModule), 
    importProvidersFrom(MatNativeDateModule), 
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    ),
    initLocaleProvider
  ]
};
