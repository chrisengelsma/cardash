import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AppRoutes } from './app.routing';
import { CommonModule } from '@angular/common';
import { DashModule } from './dash/dash.module';
import { DemoModule } from './demo/demo.module';
import { MaterialModule } from './material-module';
import { AppFontAwesomeModule } from './font-awesome';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    AppFontAwesomeModule,
    RouterModule.forRoot(AppRoutes),
    DashModule,
    DemoModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
