import { ConsoleService } from './../../services/console.service';
import { SetPlacingBot } from './../../store/app.action';
import { Component, OnInit } from '@angular/core';
import { SimulationService } from '../../services/simulation.service';
import {
  faMicrochip,
  faPause,
  faPlay,
  faPlus,
  faRedo,
  faRobot,
} from '@fortawesome/free-solid-svg-icons';
import { defaultBots } from '../battle-map/battle-map-bots';
import { environment } from '../../../environments/environment';
import { AppState } from '../../store/app.state';
import { Select, Store } from '@ngxs/store';
import { Bot } from '../battle-map/battle-map.component';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-battle-map-controls',
  templateUrl: './battle-map-controls.component.html',
  styleUrls: ['./battle-map-controls.component.scss'],
})
export class BattleMapControlsComponent implements OnInit {
  @Select(AppState.compiledBot) compiledBot$: any;

  constructor(
    public simulationService: SimulationService,
    private store: Store,
    private consoleService: ConsoleService
  ) { }

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
    this.consoleService.clear();
    this.simulationService.generateNewSimulation([50, 50], false, true);
  }

  start() {
    if (this.simulationService.simulation.statusVar.simulationStarted) {
      this.simulationService.resume();
      return;
    }
    this.simulationService.start();
  }

  pause() {
    console.log(cloneDeep(this.simulationService.simulation));
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
