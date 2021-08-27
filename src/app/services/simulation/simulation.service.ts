import { SimulationStatsService } from './simulation-stats.service';
import { ConsoleService } from '../codeenviroment/console.service';
import { Injectable, EventEmitter } from '@angular/core';
import { Bot } from '../../modules/game/components/battle-map/battle-map.component';
import { cloneDeep } from 'lodash-es';
import { environment } from 'src/environments/environment';
import {
  BotCompilerService,
  Direction,
} from '../compiler/bot-compiler.service';
import { BattleMapBufferService } from './battle-map-buffer.service';
import { defaultBots } from '../../modules/game/components/battle-map/battle-map-bots';
import { AlertService } from '../alert.service';
var perlin = require('perlin-noise');

export type GameModes = 'Color';

//simulation
export interface SimulationData {
  bots: Map<number, Bot>;
  obstacleMap: boolean[][];
  size: number[];
  clearOnStep: boolean;
  statusVar: SimulationStatusVar;
}

export interface SimulationStatusVar {
  simulationSpeed: number;
  simulationGenerated: boolean;
  simulationStarted: boolean;
  simulationPaused: boolean;
  simulatedSteps: number;
}

/**
 *Manages the simulation -> Handles Controls and Executes simulation steps
 *
 * @export
 * @class SimulationService
 */
@Injectable({
  providedIn: 'root',
})
export class SimulationService {
  emptySimulation: SimulationData = {
    bots: new Map(),
    obstacleMap: [],
    size: [0, 0],
    clearOnStep: false,
    statusVar: {
      simulationGenerated: false,
      simulationSpeed: environment.simulationSpeed,
      simulationStarted: false,
      simulationPaused: false,
      simulatedSteps: 0,
    },
  };

  stepCalculated = new EventEmitter();

  simulation: SimulationData = cloneDeep(this.emptySimulation);

  constructor(
    private botCompilerService: BotCompilerService,
    private battleMapBufferService: BattleMapBufferService,
    private consoleService: ConsoleService,
    private simulationStatsService: SimulationStatsService,
    private alert: AlertService
  ) {}

  /**
   *Generate a new Simulation enviroment.
   *
   * @param {number[]} size the size of the new map
   * @param {boolean} clearOnStep clear the map on each step
   * @param {boolean} [obstacles] should obstacles be generated
   * @param {*} [obstacleMapSettings] perlin noise settings for the obstacles
   * @param {boolean[][]} [obstacleMap] a pre generated obstacle map for the simulation
   * @memberof SimulationService
   */
  generateNewSimulation(
    size: number[],
    clearOnStep: boolean,
    obstacles?: boolean,
    obstacleMapSettings?: any,
    obstacleMap?: boolean[][]
  ) {
    this.clear(); //clear old simulation

    if (obstacleMap) {
      this.simulation.obstacleMap = obstacleMap;
    } else {
      let o = obstacles || true;
      this.simulation.obstacleMap = this.generateObstacleMap(
        size,
        o,
        obstacleMapSettings
      );
    }
    this.simulation.size = size;
    this.simulation.clearOnStep = clearOnStep;

    this.configureBattleMap();
    this.configureCompiler();

    this.simulation.statusVar.simulationGenerated = true;

    this.renderOntoMap();

    this.consoleService.print('generated new Simulation');
    this.consoleService.print('');
  }

  /**
   *add a bot to the current simulation
   *
   * @param {Bot} bot the bot to add
   * @return {*}
   * @memberof SimulationService
   */
  setBot(bot: Bot) {
    if (!bot) {
      return;
    }
    let clonedBot = cloneDeep(bot); //clone bot to avoid parse by ref artefacts
    if (this.simulation.statusVar.simulationGenerated) {
      if (
        this.botCompilerService.checkPositionOutOfBounds(clonedBot.position) //check if the bot position is valid
      ) {
        if (!this.setRandomStart(clonedBot, 3)) {
          //if invalid position generate an randomstart
          this.alert.error('No valid bot position found!');
          return;
        }
      }
      this.simulation.bots.set(clonedBot.color, clonedBot); //set bot onto map
      this.renderOntoMap(); //rerender to display the new bot
    }
  }

  /**
   *Starts the simulation by configuring all Services it and initiation the first Step
   *
   * @memberof SimulationService
   */
  start() {
    this.consoleService.print('starting Simulation...');
    this.configureCompiler();
    this.simulation.statusVar.simulationStarted = true;
    this.simulation.statusVar.simulationPaused = false;
    this.simulateStep();
  }

  /**
   *clears the simulation and sets a new empty simulation
   *
   * @memberof SimulationService
   */
  clear() {
    this.simulation.statusVar.simulationGenerated = false;
    this.simulation.statusVar.simulationStarted = false;
    this.simulation.bots = new Map();
    this.simulation = cloneDeep(this.emptySimulation);
    this.consoleService.print('cleared Simulation');
  }

  /**
   *pause the simulation
   *
   * @memberof SimulationService
   */
  pause() {
    this.simulation.statusVar.simulationPaused = true;
    this.consoleService.print('paused Simulation');
  }

  /**
   *resume the simulation
   *
   * @memberof SimulationService
   */
  resume() {
    this.simulation.statusVar.simulationPaused = false;
    this.simulateStep();
    this.consoleService.print('resumed Simulation');
  }

  /**
   *reset the simulation by clearing all bots and the map
   *
   * @memberof SimulationService
   */
  reset() {
    this.consoleService.print('reset Simulation');
    this.simulation.bots = new Map();
    this.battleMapBufferService.clearArrayBuffer(); //clear the map
    this.renderOntoMap();
  }

  /**
   *set the speed of the simulation
   *
   * @param {number} speed speed in % min and max are defined in the enviroment file
   * @memberof SimulationService
   */
  setSpeed(speed: number) {
    let diff = environment.speedRange[1] - environment.speedRange[0];
    let msSpeed = environment.speedRange[0] + (diff * speed) / 100;
    this.simulation.statusVar.simulationSpeed = msSpeed;
    this.consoleService.print('set Simulation speed to ' + speed + '%');
  }

  /**
   *generates a random bot and sets it on the map (bots are defined in the battle-map component folder)
   *
   * @return {*}
   * @memberof SimulationService
   */
  setRandomBot() {
    let bot = defaultBots[Math.floor(Math.random() * defaultBots.length)];
    let simBots = this.simulation.bots;
    if (simBots.size >= environment.availableBotColors) {
      this.consoleService.print('Error: Max Bots Reached');
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
    this.setBot(bot);
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
   * @param {number[],boolean,settings?:any} size
   * @return {*}  {boolean[][]} - the generated map
   * @memberof SimulationService
   */
  generateObstacleMap(
    size: number[],
    obstacles: boolean,
    settings?: any
  ): boolean[][] {
    this.consoleService.print('generating Obstacles...');
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
        if (noiseMap[index] > settings.threshold && obstacles) {
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
    if (this.simulation.clearOnStep) {
      this.battleMapBufferService.clearArrayBuffer(); //clear the map
    }

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

    this.simulationStatsService.updateStats();
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
        if (!this.checkPositionIsCrashed(newBotPos)) {
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

    this.simulation.statusVar.simulatedSteps++;
    this.stepCalculated.emit();

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
   *Checks if a given Position is Invalid (crashed)
   *
   * @param {number[]} pos
   * @return {*}  {boolean}
   * @memberof SimulationService
   */
  checkPositionIsCrashed(pos: number[]): boolean {
    if (
      !this.botCompilerService.checkPositionOutOfBounds(pos) &&
      !this.simulation.obstacleMap[pos[0]][pos[1]]
    ) {
      return false;
    }
    return true;
  }

  /**
   *handle bot out of bounds
   *
   * @param {Bot} bot
   * @memberof SimulationService
   */
  botOutOfBounds(bot: Bot) {
    console.log(`${bot.name} crashed into a wall`);
    this.consoleService.print(`${bot.name} crashed into a wall`);
    bot.crashed = true;
  }

  /**
   *creates a random starting point in an clear area on the map and sets the position on the bot, returns false when no position was found
   *
   * @param {Bot} bot
   * @param {number} area
   * @return {*}  {boolean} true when position successfully found
   * @memberof SimulationService
   */
  setRandomStart(bot: Bot, area: number): boolean {
    let foundValid = false;
    let invalidCounter: number = 0;
    const maxInvalid: number = 10;

    while (!foundValid && invalidCounter <= maxInvalid) {
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
      invalidCounter++;
    }

    if (foundValid) {
      return true;
    } else {
      return false;
    }
  }

  /**
   *generates a random int between two numbers
   *
   * @private
   * @param {number} min
   * @param {number} max
   * @return {*}  {number}
   * @memberof SimulationService
   */
  private getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
