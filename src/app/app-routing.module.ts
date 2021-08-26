import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './sites/landing/landing.component';
import { MobileComponent } from './sites/mobile/mobile.component';

//    canActivate: [AngularFireAuthGuard],
//data: { authGuardPipe: loggedIn },

const routes: Routes = [
  {
    path: '',
    component: window.screen.width > 1000 ? LandingComponent : MobileComponent,
  },
  {
    path: 'game',
    loadChildren: () =>
      import('./modules/game/game.module').then((m) => m.GameModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
