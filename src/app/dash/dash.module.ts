import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashComponent } from './dash.component';
import { createCustomElement } from '@angular/elements';

@NgModule({
  declarations: [
    DashComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
  ],
  providers: [
    { provide: 'Window', useValue: window }
  ],
  exports: [
    DashComponent,
  ]
})
export class DashModule {
  constructor(private injector: Injector) {
    const myElement = createCustomElement(DashComponent, { injector });
    customElements.define('app-dashboard', myElement);
  }

  ngDoBootstrap() {}
}
