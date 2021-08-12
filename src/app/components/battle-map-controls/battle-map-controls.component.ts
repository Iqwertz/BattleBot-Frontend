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

@Component({
  selector: 'app-battle-map-controls',
  templateUrl: './battle-map-controls.component.html',
  styleUrls: ['./battle-map-controls.component.scss'],
})
export class BattleMapControlsComponent implements OnInit {
  @Select(AppState.compiledBot) compiledBot$: any;

  constructor(public simulationService: SimulationService, private store: Store) { }

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
    this.simulationService.generateNewSimulation([50, 50]);
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
    let bot = defaultBots[Math.floor(Math.random() * defaultBots.length)];
    let simBots = this.simulationService.simulation.bots;
    if (simBots.size >= environment.availableBotColors) {
      console.log('error: Max Bots Reached');
      return;
    }

    let colorFound = false;
    let botColor = 5;

    while (!colorFound) {
      botColor = this.getRandomInt(
        environment.botByteRange[0],
        environment.botByteRange[1]
      );
      if (botColor % 2 == 0) {
        botColor++;
      }
      if (!simBots.has(botColor)) {
        colorFound = true;
      }
    }

    bot.color = botColor;
    bot.trackColor = botColor + 1;
    this.simulationService.setBot(bot);
  }

  setBot() {
    this.store.dispatch(new SetPlacingBot(true));
  }

  private getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
