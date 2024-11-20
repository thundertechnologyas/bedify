import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'BookingEngine';

  constructor( private route: ActivatedRoute) {
    let sessionId = sessionStorage.getItem("sessionid");
    if (!sessionId) {
      this.restart();
    }
  }

  restart() {
    // TODO -- cleanup.
  }
  
  getUniqueId(parts: number): string {
    const stringArr = [];
    for(let i = 0; i< parts; i++){
      // tslint:disable-next-line:no-bitwise
      const S4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      stringArr.push(S4);
    }
    return stringArr.join('-');
  }

  @ViewChild("contentarea")
  private contentarea!: ElementRef;

  scrollToTop(): void {
    this.contentarea.nativeElement.scrollTop = 0;
  }

}
