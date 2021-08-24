import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './sites/landing/landing.component';

//    canActivate: [AngularFireAuthGuard],
//data: { authGuardPipe: loggedIn },

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'game',
    loadChildren: () =>
      import('./modules/game/game.module').then((m) => m.GameModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
