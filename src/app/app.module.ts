import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './sites/landing/landing.component';
import { PlayComponent } from './sites/play/play.component';
import { BattleMapComponent } from './components/battle-map/battle-map.component';
import { BotEditorComponent } from './sites/bot-editor/bot-editor.component';
import { EditorIdeComponent } from './components/editor-ide/editor-ide.component';
import { SimulationSettingsComponent } from './components/simulation-settings/simulation-settings.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DragdropCommandComponent } from './components/dragdrop-command/dragdrop-command.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatSelectModule } from '@angular/material/select';
import { DragdropLogicCommandComponent } from './components/dragdrop-logic-command/dragdrop-logic-command.component';
import { DropTerminalComponent } from './components/drop-terminal/drop-terminal.component';
import { DragdropPreviewComponent } from './components/dragdrop-preview/dragdrop-preview.component';
import { BattleMapControlsComponent } from './components/battle-map-controls/battle-map-controls.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ConsoleComponent } from './components/console/console.component';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { AppState } from './store/app.state';
import { LobbySelectComponent } from './components/lobby-select/lobby-select.component';
import { PrivateLobbyCodeComponent } from './components/private-lobby-code/private-lobby-code.component';
import { PublicLobbysComponent } from './components/public-lobbys/public-lobbys.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { environment } from '../environments/environment';
import { DragdropCodeFunctionComponent } from './components/dragdrop-code-function/dragdrop-code-function.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { CreateLobbyComponent } from './sites/create-lobby/create-lobby.component';
import { PlayerListComponent } from './components/player-list/player-list.component';
import { LobbySettingsComponent } from './components/lobby-settings/lobby-settings.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { SimulationStatsComponent } from './components/simulation-stats/simulation-stats.component';
import { SimulationLeaderboardComponent } from './components/simulation-leaderboard/simulation-leaderboard.component';
import { GameComponent } from './sites/game/game.component';
import { LogoutComponent } from './components/logout/logout.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    PlayComponent,
    BattleMapComponent,
    BotEditorComponent,
    EditorIdeComponent,
    SimulationSettingsComponent,
    DragdropCommandComponent,
    DragdropLogicCommandComponent,
    DropTerminalComponent,
    DragdropPreviewComponent,
    BattleMapControlsComponent,
    ConsoleComponent,
    LobbySelectComponent,
    PrivateLobbyCodeComponent,
    PublicLobbysComponent,
    DragdropCodeFunctionComponent,
    CreateLobbyComponent,
    PlayerListComponent,
    LobbySettingsComponent,
    SimulationStatsComponent,
    SimulationLeaderboardComponent,
    GameComponent,
    LogoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxsModule.forRoot([AppState]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    BrowserAnimationsModule,
    DragDropModule,
    FontAwesomeModule,
    MatSelectModule,
    MatTooltipModule,
    MatButtonToggleModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
    MatInputModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatRippleModule,
    MatIconModule,
    MatCheckboxModule,
    MatSliderModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
