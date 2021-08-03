import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayComponent } from './sites/play/play.component';
import { LandingComponent } from './sites/landing/landing.component';

const routes: Routes = [
  {
    path: 'play',
    component: PlayComponent,
  },
  {
    path: '',
    component: LandingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
