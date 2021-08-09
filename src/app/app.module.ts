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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DragDropModule,
    FontAwesomeModule,
    MatSelectModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
