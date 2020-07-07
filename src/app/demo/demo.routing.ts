import { Routes } from '@angular/router';
import { DemoComponent } from './demo.component';

export const AppDemoRoutes: Routes = [
  {
    path: 'demo',
    children: [
      { path: '', component: DemoComponent },
    ]
  },
];
