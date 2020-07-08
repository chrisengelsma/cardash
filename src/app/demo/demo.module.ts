import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashModule } from '../dash/dash.module';
import { ControlsComponent } from './controls/controls.component';
import { RouterModule } from '@angular/router';
import { AppDemoRoutes } from './demo.routing';
import { DemoComponent } from './demo.component';
import { MatSliderModule } from '@angular/material/slider';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DemoComponent,
    ControlsComponent,
  ],
  imports: [
    DashModule,
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MaterialModule,
    RouterModule.forRoot(AppDemoRoutes),
    CommonModule,
    MatSliderModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DemoModule {}
