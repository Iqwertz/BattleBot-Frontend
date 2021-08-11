import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { bot1, bot2, bot3 } from './battle-map-bots';
import { BattleMapBufferService } from '../../services/battle-map-buffer.service';
import {
  BotCompilerService,
  BrainData,
  Direction,
} from '../../services/bot-compiler.service';
import { SimulationData } from 'src/app/services/simulation.service';
import {
  SimulationService,
  SimulationStatusVar,
} from '../../services/simulation.service';

//configuration of a bot
export interface Bot {
  name: string;
  position: number[];
  color: number;
  track: number[][];
  trackLength: number;
  trackColor: number;
  direction: Direction;
  brain: BrainData;
  crashed: boolean;
}

/**
 * Battle Map - renders to the Battle map and handles its logic on the basic level
 *
 * @export
 * @class BattleMapComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-battle-map',
  templateUrl: './battle-map.component.html',
  styleUrls: ['./battle-map.component.scss'],
})
export class BattleMapComponent implements OnInit {
  //variables
  simulationSpeed = environment.simulationSpeed;
  byteColorMap = new Map(Object.entries(environment.byteColorMap));
  battleMapSize: number[] = environment.defaultMapSize;

  simulationStatusVar: SimulationStatusVar = {
    simulationGenerated: false,
    simulationSpeed: 0,
    simulationStarted: false,
  };

  constructor(
    private battleMapBufferService: BattleMapBufferService,
    private simulationService: SimulationService
  ) {
    this.simulationStatusVar = this.simulationService.simulation.statusVar;
  }

  ngOnInit(): void {
    this.simulationService.generateNewSimulation([200, 200]);
    this.simulationService.setBot(bot1);
    this.simulationService.setBot(bot2);
    this.simulationService.setBot(bot3);
    console.log(this.simulationService.simulation.statusVar);
    console.log(this.simulationStatusVar);
    /*//generate random starts for the bots
    this.simulation.bots.forEach((bot) => {
      this.setRandomStart(bot, 3);
    }); */
  }

  /**
   *read a value from the battlemap Buffer
   *
   * @param {number} x
   * @param {number} y
   * @return {*}  {number}
   * @memberof BattleMapComponent
   */
  getBattleMapBufferValue(x: number, y: number): number {
    return this.battleMapBufferService.getBattleMapBufferValue(x, y);
  }

  //isnt very clean but angular cant loop over numbers only collections :(
  /**
   *create a fake array to loop through when creating the map with ngfor
   *
   * @param {number} length
   * @return {*}  {Array<any>}
   * @memberof BattleMapComponent
   */
  fakeArray(length: number): Array<any> {
    if (length >= 0) {
      return new Array(length);
    }
    return new Array(0);
  }

  /**
   *creates a random stArting point in an clear area on the map, (still has some bugs)
   *
   * @param {Bot} bot
   * @param {number} area
   * @memberof BattleMapComponent
   */
  /* setRandomStart(bot: Bot, area: number) {
    let foundValid = false;

    while (!foundValid) {
      try {
        let randomStart = [
          Math.floor(Math.random() * this.battleMapSize[0] - 2 * area) + area,
          Math.floor(Math.random() * this.battleMapSize[1] - 2 * area) + area,
        ];
        let obstacleNear = false;
        let checkSpotStart = [
          randomStart[0] - Math.floor(area / 2),
          randomStart[1] - Math.floor(area / 2),
        ];
        for (let i = 0; i < area; i++) {
          for (let j = 0; j < area; j++) {
            if (
              this.simulation.obstacleMap[checkSpotStart[0] + i][
                checkSpotStart[1] + j
              ]
            ) {
              obstacleNear = true;
            }
          }
        }

        if (!obstacleNear) {
          bot.position = randomStart;
          foundValid = true;
        }
      } catch {} //not clean! I know but will be removed in the end
    }
  } */
}
