import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { appConfig } from './app/app.config';

import { AppModule } from './app/app.module';
import { createApplication } from '@angular/platform-browser';
import { HeaderComponent } from './app/components/header/header.component';
import { createCustomElement } from '@angular/elements';
import { BedifyBookingHeader } from './app/components/bedify-booking-header/bedify-booking-header.component';
import { BedifyContentComponent } from './app/components/bedify-content/bedify-content.component';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));


createApplication(appConfig)
.then((app) => {
  
    const bedifyHeader = createCustomElement(BedifyBookingHeader, { injector: app.injector });
    const bedifyContent = createCustomElement(BedifyContentComponent, { injector: app.injector });

    customElements.define('bedify-header', bedifyHeader);
    customElements.define('bedify-content', bedifyContent);
})
.catch((err) => console.error(err));