import { Routes } from '@angular/router';

export const full: Routes = [

  {
    path: 'authentication',
    loadChildren: () => import('../../pages/authentication/authentication.module').then(m => m.AuthenticationModule),
  }
];
