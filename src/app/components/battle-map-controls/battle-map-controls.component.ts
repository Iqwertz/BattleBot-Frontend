import { Component, OnInit } from '@angular/core';
import { SimulationService } from '../../services/simulation.service';
import {
  faPause,
  faPlay,
  faPlus,
  faRedo,
  faRobot,
} from '@fortawesome/free-solid-svg-icons';
import { defaultBots } from '../battle-map/battle-map-bots';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-battle-map-controls',
  templateUrl: './battle-map-controls.component.html',
  styleUrls: ['./battle-map-controls.component.scss'],
})
export class BattleMapControlsComponent implements OnInit {
  constructor(public simulationService: SimulationService) {}

  ngOnInit(): void {}

  faPlay = faPlay;
  faPause = faPause;
  faPlus = faPlus;
  faRedo = faRedo;
  faRobot = faRobot;

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
  private getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
