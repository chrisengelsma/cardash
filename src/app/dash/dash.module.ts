import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashComponent } from './dash.component';

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
export class DashModule {}
