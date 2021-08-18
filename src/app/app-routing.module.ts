import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayComponent } from './sites/play/play.component';
import { LandingComponent } from './sites/landing/landing.component';
import { BotEditorComponent } from './sites/bot-editor/bot-editor.component';
import { CreateLobbyComponent } from './sites/create-lobby/create-lobby.component';
import { AngularFireAuthGuard, loggedIn } from '@angular/fire/auth-guard';

const routes: Routes = [
  {
    path: 'createLobby/:id',
    component: CreateLobbyComponent,
  },
  {
    path: 'editor',
    component: BotEditorComponent,
    canActivate: [AngularFireAuthGuard],
    //data: { authGuardPipe: loggedIn },
  },
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
