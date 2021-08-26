import { ConsoleService } from '../../../../services/codeenviroment/console.service';
import { SetPlacingBot } from '../../../../store/app.action';
import { Component, OnInit } from '@angular/core';
import { SimulationService } from '../../../../services/simulation/simulation.service';
import {
  faMicrochip,
  faPause,
  faPlay,
  faPlus,
  faRedo,
  faRobot,
} from '@fortawesome/free-solid-svg-icons';
import { AppState } from '../../../../store/app.state';
import { Select, Store } from '@ngxs/store';
import { Bot } from '../battle-map/battle-map.component';
import { LobbyRef } from '../../../../services/firebase/firebase-lobby.service';

@Component({
  selector: 'app-battle-map-controls',
  templateUrl: './battle-map-controls.component.html',
  styleUrls: ['./battle-map-controls.component.scss'],
})
export class BattleMapControlsComponent implements OnInit {
  @Select(AppState.compiledBot) compiledBot$: any;

  @Select(AppState.currentLobby) currentLobby$: any;
  currentLobby: LobbyRef | undefined;

  constructor(
    public simulationService: SimulationService,
    private store: Store,
    private consoleService: ConsoleService
  ) {
    this.currentLobby$.subscribe((newLobby: LobbyRef | undefined) => {
      this.currentLobby = newLobby;
      this.generate();
    });
  }

  compiledBotAvailable = false;

  ngOnInit(): void {
    this.compiledBot$.subscribe((cBot: Bot) => {
      if (cBot) {
        this.compiledBotAvailable = true;
      } else {
        this.compiledBotAvailable = false;
      }
    });
  }

  faPlay = faPlay;
  faPause = faPause;
  faPlus = faPlus;
  faRedo = faRedo;
  faRobot = faRobot;
  faMicrochip = faMicrochip;

  generate() {
    if (this.currentLobby) {
      this.consoleService.clear();

      let clearOnStep = true;

      if (this.currentLobby.settings.mode == 'Color') {
        clearOnStep = false;
      }
      this.simulationService.generateNewSimulation(
        [
          this.currentLobby.settings.mapSize,
          this.currentLobby.settings.mapSize,
        ],
        clearOnStep,
        this.currentLobby.settings.obstacles,
        this.currentLobby.settings.obstacleSettings
      );
    }
  }

  start() {
    if (this.simulationService.simulation.statusVar.simulationStarted) {
      this.simulationService.resume();
      return;
    }
    this.simulationService.start();
  }

  pause() {
    this.simulationService.pause();
  }

  reset() {
    this.simulationService.reset();
  }

  randomBot() {
    this.simulationService.setRandomBot();
  }

  setBot() {
    this.store.dispatch(new SetPlacingBot(true));
  }
}
