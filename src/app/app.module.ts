import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './sites/landing/landing.component';
import { PlayComponent } from './sites/play/play.component';
import { BattleMapComponent } from './components/battle-map/battle-map.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    PlayComponent,
    BattleMapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
