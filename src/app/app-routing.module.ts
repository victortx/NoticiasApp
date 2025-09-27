import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthGuard} from './Interceptor/auth-guard';

export const routes: Routes = [
  {
    path: 'noticias',
    loadChildren: () => import('./noticias/noticias-module')
      .then(m => m.NoticiasModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth-module')
      .then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./admin/admin-module')
      .then(m => m.AdminModule),
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: 'noticias', pathMatch: 'full' },
  { path: '**', redirectTo: 'noticias' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
