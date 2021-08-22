import { GameComponent } from './sites/game/game.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayComponent } from './sites/play/play.component';
import { LandingComponent } from './sites/landing/landing.component';
import { BotEditorComponent } from './sites/bot-editor/bot-editor.component';
import { CreateLobbyComponent } from './sites/create-lobby/create-lobby.component';
import { AngularFireAuthGuard, loggedIn } from '@angular/fire/auth-guard';

//    canActivate: [AngularFireAuthGuard],
//data: { authGuardPipe: loggedIn },

const routes: Routes = [
  {
    path: 'createLobby/:id',
    component: CreateLobbyComponent,
  },
  {
    path: 'editor',
    component: BotEditorComponent,
  },
  {
    path: 'play',
    component: PlayComponent,
  },
  {
    path: 'game',
    component: GameComponent
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
export class AppRoutingModule { }
