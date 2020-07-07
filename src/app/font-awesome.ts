import { NgModule } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

@NgModule({
  exports: [FontAwesomeModule]
})
export class AppFontAwesomeModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }

}
