import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { EditorInfoComponent } from '../../components/editor-info/editor-info.component';
import { LogoutComponent } from '../../components/logout/logout.component';
import { GameComponent } from 'src/app/sites/game/game.component';
import { SimulationLeaderboardComponent } from '../../components/simulation-leaderboard/simulation-leaderboard.component';
import { SimulationStatsComponent } from '../../components/simulation-stats/simulation-stats.component';
import { LobbySettingsComponent } from '../../components/lobby-settings/lobby-settings.component';
import { PlayerListComponent } from '../../components/player-list/player-list.component';
import { CreateLobbyComponent } from '../../sites/create-lobby/create-lobby.component';
import { DragdropCodeFunctionComponent } from '../../components/dragdrop-code-function/dragdrop-code-function.component';
import { ConsoleComponent } from '../../components/console/console.component';
import { BattleMapControlsComponent } from '../../components/battle-map-controls/battle-map-controls.component';
import { DragdropPreviewComponent } from '../../components/dragdrop-preview/dragdrop-preview.component';
import { DropTerminalComponent } from '../../components/drop-terminal/drop-terminal.component';
import { DragdropLogicCommandComponent } from '../../components/dragdrop-logic-command/dragdrop-logic-command.component';
import { DragdropCommandComponent } from '../../components/dragdrop-command/dragdrop-command.component';
import { SimulationSettingsComponent } from '../../components/simulation-settings/simulation-settings.component';
import { EditorIdeComponent } from '../../components/editor-ide/editor-ide.component';
import { BotEditorComponent } from '../../sites/bot-editor/bot-editor.component';
import { BattleMapComponent } from '../../components/battle-map/battle-map.component';
import { PlayComponent } from '../../sites/play/play.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsModule } from '@ngxs/store';
import { environment } from 'src/environments/environment';
import { ConfettiComponent } from '../../components/confetti/confetti.component';
import { BattleMapWinOverlayComponent } from '../../components/battle-map-win-overlay/battle-map-win-overlay.component';

@NgModule({
  declarations: [
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
    DragdropCodeFunctionComponent,
    CreateLobbyComponent,
    PlayerListComponent,
    LobbySettingsComponent,
    SimulationStatsComponent,
    SimulationLeaderboardComponent,
    GameComponent,
    LogoutComponent,
    EditorInfoComponent,
    ConfettiComponent,
    BattleMapWinOverlayComponent,
  ],
  imports: [
    CommonModule,
    GameRoutingModule,
    NgxsModule,
    NgxsReduxDevtoolsPluginModule,
    DragDropModule,
    FontAwesomeModule,
    MatSelectModule,
    MatTooltipModule,
    MatButtonToggleModule,
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
    MatSnackBarModule,
  ],
  exports: [],
})
export class GameModule {}
