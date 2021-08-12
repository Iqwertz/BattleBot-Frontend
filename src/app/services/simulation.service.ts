import { Injectable, Inject } from '@angular/core';
import { Bot } from '../components/battle-map/battle-map.component';
import { cloneDeep } from 'lodash';
import { environment } from 'src/environments/environment';
import { BotCompilerService, Direction } from './bot-compiler.service';
import { BattleMapBufferService } from './battle-map-buffer.service';
import { Subject } from 'rxjs';
var perlin = require('perlin-noise');

//simulation
export interface SimulationData {
  bots: Map<number, Bot>;
  obstacleMap: boolean[][];
  size: number[];
  statusVar: SimulationStatusVar;
}

export interface SimulationStatusVar {
  simulationSpeed: number;
  simulationGenerated: boolean;
  simulationStarted: boolean;
  simulationPaused: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SimulationService {
  emptySimulation: SimulationData = {
    bots: new Map(),
    obstacleMap: [],
    size: [0, 0],
    statusVar: {
      simulationGenerated: false,
      simulationSpeed: environment.simulationSpeed,
      simulationStarted: false,
      simulationPaused: false,
    },
  };
  simulation: SimulationData = cloneDeep(this.emptySimulation); //Hier weiter mit simulationvar changed und subscribe in battlemap compoonent

  constructor(
    private botCompilerService: BotCompilerService,
    private battleMapBufferService: BattleMapBufferService
  ) {}

  generateNewSimulation(size: number[], obstacleMapSettings?: any) {
    this.clear();

    this.simulation.obstacleMap = this.generateObstacleMap(
      size,
      obstacleMapSettings
    );
    this.simulation.size = size;

    this.configureBattleMap();
    this.configureCompiler();

    this.simulation.statusVar.simulationGenerated = true;

    this.renderOntoMap();
  }

  setBot(bot: Bot) {
    if (!bot) {
      return;
    }
    let clonedBot = cloneDeep(bot);
    if (this.simulation.statusVar.simulationGenerated) {
      if (
        this.botCompilerService.checkPositionOutOfBounds(clonedBot.position)
      ) {
        this.setRandomStart(clonedBot, 3);
      }
      this.simulation.bots.set(clonedBot.color, clonedBot);
      this.renderOntoMap();
    }
  }

  /**
   *Starts the simulation by configuring all Services it and initiation the first Step
   *
   * @memberof SimulationService
   */
  start() {
    this.configureCompiler();
    this.simulation.statusVar.simulationStarted = true;
    this.simulation.statusVar.simulationPaused = false;
    this.simulateStep();
  }

  clear() {
    this.simulation.statusVar.simulationGenerated = false;
    this.simulation.statusVar.simulationStarted = false;
    this.simulation = cloneDeep(this.emptySimulation);
  }

  pause() {
    this.simulation.statusVar.simulationPaused = true;
  }

  resume() {
    this.simulation.statusVar.simulationPaused = false;
    this.simulateStep();
  }

  reset() {
    this.simulation.bots = new Map();
  }

  setSpeed(speed: number) {
    this.simulation.statusVar.simulationSpeed = speed;
  }

  /**
   *configures all vars of the compiler service
   *
   * @memberof SimulationService
   */
  configureCompiler() {
    this.botCompilerService.battleMapSize = this.simulation.size;
    this.botCompilerService.setSimulationData(this.simulation);
  }

  /**
   *configures all vars for the battleMap service
   *
   * @memberof SimulationService
   */
  configureBattleMap() {
    this.battleMapBufferService.battleMapSize = this.simulation.size;
    this.battleMapBufferService.clearArrayBuffer();
  }

  /**
   *generates an obstacle map with perlin noise
   *
   * @param {number[],settings?:any} size
   * @return {*}  {boolean[][]} - the generated map
   * @memberof SimulationService
   */
  generateObstacleMap(size: number[], settings?: any): boolean[][] {
    if (!settings) {
      settings = environment.obstacleNoiseSettings;
    }
    let obstacleMap: boolean[][] = [];
    let noiseMap = perlin.generatePerlinNoise(size[0], size[1], settings); //generate 1d perlin noise array

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
   *render all Layers onto the ArrayBuffer
   *
   * @memberof SimulationService
   */
  renderOntoMap() {
    this.battleMapBufferService.clearArrayBuffer(); //clear the map

    for (let i = 0; i < this.simulation.size[0]; i++) {
      //render obstacles
      for (let j = 0; j < this.simulation.size[1]; j++) {
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
   *simulates a step and calls itself with a timeout
   *
   * @memberof SimulationService
   */
  simulateStep() {
    this.simulation.bots.forEach((bot: Bot) => {
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

    if (
      !this.simulation.statusVar.simulationPaused &&
      this.simulation.statusVar.simulationStarted
    ) {
      setTimeout(() => {
        this.simulateStep();
      }, this.simulation.statusVar.simulationSpeed); //set timeout for next step
    }
  }

  /**
   *handle bot out of bounds
   *
   * @param {Bot} bot
   * @memberof SimulationService
   */
  botOutOfBounds(bot: Bot) {
    console.log(`${bot.name} crashed into a wall`);
    bot.crashed = true;
  }

  /**
   *creates a random stArting point in an clear area on the map
   *
   * @param {Bot} bot
   * @param {number} area
   * @memberof SimulationService
   */
  setRandomStart(bot: Bot, area: number) {
    let foundValid = false;

    while (!foundValid) {
      let randomStart = [
        Math.floor(Math.random() * this.simulation.size[0] - 2 * area) + area,
        Math.floor(Math.random() * this.simulation.size[1] - 2 * area) + area,
      ];
      let obstacleNear = false;
      let checkSpotStart = [
        randomStart[0] - Math.floor(area / 2),
        randomStart[1] - Math.floor(area / 2),
      ];
      for (let i = 0; i < area; i++) {
        for (let j = 0; j < area; j++) {
          if (
            this.botCompilerService.checkPositionOutOfBounds(checkSpotStart)
          ) {
            obstacleNear = true;
            i = area;
            break;
          } else if (
            this.simulation.obstacleMap[checkSpotStart[0] + i][
              checkSpotStart[1] + j
            ]
          ) {
            obstacleNear = true;
            console.log('near Obstacle');
            i = area;
            break;
          }
        }
      }

      if (!obstacleNear) {
        bot.position = randomStart;
        foundValid = true;
      }
    }
  }
}
