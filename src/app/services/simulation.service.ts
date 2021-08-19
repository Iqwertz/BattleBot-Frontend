import { ConsoleService } from './console.service';
import { Injectable } from '@angular/core';
import { Bot } from '../components/battle-map/battle-map.component';
import { cloneDeep } from 'lodash';
import { environment } from 'src/environments/environment';
import { BotCompilerService, Direction } from './bot-compiler.service';
import { BattleMapBufferService } from './battle-map-buffer.service';
import { defaultBots } from '../components/battle-map/battle-map-bots';
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
}

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
    },
  };
  simulation: SimulationData = cloneDeep(this.emptySimulation);

  constructor(
    private botCompilerService: BotCompilerService,
    private battleMapBufferService: BattleMapBufferService,
    private consoleService: ConsoleService
  ) {}

  generateNewSimulation(
    size: number[],
    clearOnStep: boolean,
    obstacles?: boolean,
    obstacleMapSettings?: any,
    obstacleMap?: boolean[][]
  ) {
    this.clear();

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
    this.consoleService.print('starting Simulation...');
    this.configureCompiler();
    this.simulation.statusVar.simulationStarted = true;
    this.simulation.statusVar.simulationPaused = false;
    this.simulateStep();
  }

  clear() {
    this.simulation.statusVar.simulationGenerated = false;
    this.simulation.statusVar.simulationStarted = false;
    this.simulation.bots = new Map();
    this.simulation = cloneDeep(this.emptySimulation);
    this.consoleService.print('cleared Simulation');
  }

  pause() {
    this.simulation.statusVar.simulationPaused = true;
    this.consoleService.print('paused Simulation');
  }

  resume() {
    this.simulation.statusVar.simulationPaused = false;
    this.simulateStep();
    this.consoleService.print('resumed Simulation');
  }

  reset() {
    this.consoleService.print('reset Simulation');
    this.simulation.bots = new Map();
    this.battleMapBufferService.clearArrayBuffer(); //clear the map
    this.renderOntoMap();
  }

  setSpeed(speed: number) {
    let msSpeed = (environment.speedRange[1] * speed) / 100; //This isnt using the lower range of the defined speed but it doesnt really matter
    this.simulation.statusVar.simulationSpeed = msSpeed;
    this.consoleService.print('set Simulation speed to ' + speed + '%');
    console.log('set Simulation speed to ' + msSpeed);
  }

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

    if (
      !this.simulation.statusVar.simulationPaused &&
      this.simulation.statusVar.simulationStarted
    ) {
      setTimeout(() => {
        requestAnimationFrame(() => {
          this.simulateStep();
        });
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

  private getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
