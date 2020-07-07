import { NgModule } from '@angular/core';
import { DataService } from './_services/data.service';
import { WindowRefService } from './_services/window-ref.service';

@NgModule({
  providers: [
    DataService,
    WindowRefService
  ],
})
export class AppServiceModule {}
