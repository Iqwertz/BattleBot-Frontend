import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { bot1, bot2, bot3 } from './battle-map-bots';
import { BattleMapBufferService } from '../../services/battle-map-buffer.service';
import {
  BotCompilerService,
  BrainData,
  Direction,
} from '../../services/bot-compiler.service';
var perlin = require('perlin-noise');

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

//simulation
export interface SimulationData {
  bots: Map<number, Bot>;
  obstacleMap: boolean[][];
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

  simulation: SimulationData = {
    bots: new Map<number, Bot>(),
    obstacleMap: [],
  };

  constructor(
    private botCompilerService: BotCompilerService,
    private battleMapBufferService: BattleMapBufferService
  ) {}

  ngOnInit(): void {
    (this.simulation.obstacleMap = this.generateObstacleMap(
      this.battleMapSize
    )), //generate a obstacle Map
      //add Bots to simulation
      this.simulation.bots.set(bot1.color, bot1);
    this.simulation.bots.set(bot2.color, bot2);
    this.simulation.bots.set(bot3.color, bot3);

    //generate random starts for the bots
    this.simulation.bots.forEach((bot) => {
      this.setRandomStart(bot, 3);
    });
    this.startSimulation(); //start the simulation
  }

  /**
   *generates an obstacle map with perlin noise
   *
   * @param {number[]} size
   * @return {*}  {boolean[][]} - the generated map
   * @memberof BattleMapComponent
   */
  generateObstacleMap(size: number[]): boolean[][] {
    let obstacleMap: boolean[][] = [];
    let noiseMap = perlin.generatePerlinNoise(
      size[0],
      size[1],
      environment.obstacleNoiseSettings
    ); //generate 1d perlin noise array

    for (let i = 0; i < size[0]; i++) {
      //map 1d array onto 2d map
      let row: boolean[] = [];
      for (let j = 0; j < size[1]; j++) {
        let index = i * size[0] + j;
        if (noiseMap[index] > environment.obstacleNoiseSettings.threshold) {
          row.push(true);
        } else {
          row.push(false);
        }
      }
      obstacleMap.push(row);
    }

    return obstacleMap;
  }

  /**
   *Starts the simulation by configuring all Services it and initiation the first Step
   *
   * @memberof BattleMapComponent
   */
  startSimulation() {
    this.configureBattleMap();
    this.configureCompiler();
    this.simulateStep();
  }

  /**
   *configures all vars of the compiler service
   *
   * @memberof BattleMapComponent
   */
  configureCompiler() {
    this.botCompilerService.battleMapSize = this.battleMapSize;
    this.botCompilerService.simulation = this.simulation;
  }

  /**
   *configures all vars for the battleMap service
   *
   * @memberof BattleMapComponent
   */
  configureBattleMap() {
    this.battleMapBufferService.battleMapSize = this.battleMapSize;
    this.battleMapBufferService.clearArrayBuffer();
  }

  /**
   *simulates a step and calls itself with a timeout
   *
   * @memberof BattleMapComponent
   */
  simulateStep() {
    this.simulation.bots.forEach((bot) => {
      //go through each bot
      if (!bot.crashed) {
        //check if bot crashed

        let nextInstruction = this.botCompilerService.getNextInstruction(bot); //calculate the next instructions

        for (let i = 0; i < nextInstruction.length; i++) {
          //execute the instructions
          bot.direction = this.botCompilerService.calculateMoveDirection(
            bot.direction,
            nextInstruction[i]
          );
        }

        let movingDirection: Direction =
          this.botCompilerService.calculateMoveDirection(
            bot.direction,
            'forward'
          ); //calculate moving direction

        let newBotPos: number[] = bot.position.slice(0); //create a  copy of the bot position

        bot.direction = movingDirection;

        switch (
          movingDirection //change bot position according to the
        ) {
          case 'down':
            newBotPos[0]++;
            break;
          case 'left':
            newBotPos[1]--;
            break;
          case 'up':
            newBotPos[0]--;
            break;
          case 'right':
            newBotPos[1]++;
            break;
        }

        if (!this.botCompilerService.checkPositionOutOfBounds(newBotPos)) {
          //check if newPosition is out of bounds(crashed)
          bot.track.push(bot.position.slice(0));

          if (bot.track.length > bot.trackLength) {
            bot.track.shift();
          }
          bot.position = newBotPos;
        } else {
          this.botOutOfBounds(bot); //alert bot out of bounds
        }
      }
    });

    this.renderOntoMap(); //render new map
    setTimeout(() => {
      this.simulateStep();
    }, this.simulationSpeed); //set timeout for next step
  }

  /**
   *handle bot out of bounds
   *
   * @param {Bot} bot
   * @memberof BattleMapComponent
   */
  botOutOfBounds(bot: Bot) {
    console.log(`${bot.name} crashed into a wall`);
    bot.crashed = true;
  }

  /**
   *render all Layers onto the ArrayBuffer
   *
   * @memberof BattleMapComponent
   */
  renderOntoMap() {
    this.battleMapBufferService.clearArrayBuffer(); //clear the map

    for (let i = 0; i < this.battleMapSize[0]; i++) {
      //render obstacles
      for (let j = 0; j < this.battleMapSize[1]; j++) {
        if (this.simulation.obstacleMap[i][j]) {
          this.battleMapBufferService.setToBattleMapBuffer([i, j], 1);
        }
      }
    }

    this.simulation.bots.forEach((bot) => {
      //render each bot
      for (let trackElement of bot.track) {
        //render tracks
        this.battleMapBufferService.setToBattleMapBuffer(
          trackElement,
          bot.trackColor
        );
      }
      this.battleMapBufferService.setToBattleMapBuffer(bot.position, bot.color); //render bot
    });
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
  setRandomStart(bot: Bot, area: number) {
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
  }
}
