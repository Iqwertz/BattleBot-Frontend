import { newArray } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
var perlin = require('perlin-noise');

export type TileTypes = 'air' | 'wall' | 'player' | 'track';

export interface TileData {
  type: TileTypes;
  color?: number;
}

export type Instruction = 'forward' | 'left' | 'right';

export type Direction = 'left' | 'right' | 'up' | 'down';

export interface InstructionSet {
  progress: number;
  instructions: Instruction[];
}

export interface BrainData {
  default: InstructionSet;
}

export interface Bot {
  name: string;
  position: number[];
  color: number;
  track: number[][];
  trackLength: number;
  direction: Direction;
  brain: BrainData;
  crashed: boolean;
}

export interface SimulationData {
  bots: Bot[];
  obstacleMap: boolean[][];
}

@Component({
  selector: 'app-battle-map',
  templateUrl: './battle-map.component.html',
  styleUrls: ['./battle-map.component.scss'],
})
export class BattleMapComponent implements OnInit {
  simulationSpeed = environment.simulationSpeed;
  battleMapSize: number[] = [60, 60];
  emptyTile: TileData = {
    type: 'air',
  };

  battleMapBuffer: Uint8Array = this.generateArrayBuffer(
    this.battleMapSize[0] * this.battleMapSize[1]
  );

  bot: Bot = {
    name: 'Bot1',
    color: 0x59ffc2,
    position: [this.battleMapSize[0] - 1, 0],
    direction: 'up',
    track: [],
    trackLength: 7,
    crashed: false,
    brain: {
      default: {
        progress: 0,
        instructions: [
          'forward',
          'forward',
          'left',
          'forward',
          'forward',
          'right',
          'right',
          'left',
        ],
      },
    },
  };

  bot2: Bot = {
    name: 'Bot2',
    color: 0x59ffc2,
    position: [this.battleMapSize[0] / 2, this.battleMapSize[1] / 2],
    direction: 'right',
    track: [],
    trackLength: 40,
    crashed: false,
    brain: {
      default: {
        progress: 0,
        instructions: [
          'left',
          'forward',
          'left',
          'right',
          'left',
          'right',
          'forward',
          'left',
          'right',
          'forward',
          'right',
          'forward',
          'left',
          'left',
          'left',
          'forward',
          'forward',
          'forward',
          'right',
          'right',
        ],
      },
    },
  };

  simulation: SimulationData = {
    bots: [this.bot, this.bot2],
    obstacleMap: this.generateObstacleMap(this.battleMapSize),
  };

  constructor() {}

  ngOnInit(): void {
    this.startSimulation();
  }

  generateArrayBuffer(bufferSize: number): Uint8Array {
    let buffer = new ArrayBuffer(bufferSize);
    let view = new Uint8Array(buffer);

    return view;
  }

  generateObstacleMap(size: number[]): boolean[][] {
    let obstacleMap: boolean[][] = [];
    let noiseMap = perlin.generatePerlinNoise(
      size[0],
      size[1],
      environment.obstacleNoiseSettings
    );

    for (let i = 0; i < size[0]; i++) {
      let row: boolean[] = [];
      for (let j = 0; j < size[1]; j++) {
        let index = i * size[0] + j;
        if (noiseMap[index] > 0.65) {
          row.push(true);
        } else {
          row.push(false);
        }
      }
      obstacleMap.push(row);
    }

    return obstacleMap;
  }

  startSimulation() {
    this.renderOntoMap();
    this.simulateStep();
  }

  simulateStep() {
    for (let bot of this.simulation.bots) {
      if (!bot.crashed) {
        let nextInstruction =
          bot.brain.default.instructions[bot.brain.default.progress];
        let movingDirection: Direction = this.calculateMoveDirection(
          bot.direction,
          nextInstruction
        );

        let newBotPos: number[] = bot.position.slice(0);

        bot.direction = movingDirection;

        switch (movingDirection) {
          case 'down':
            newBotPos[1]--;
            break;
          case 'left':
            newBotPos[0]--;
            break;
          case 'up':
            newBotPos[1]++;
            break;
          case 'right':
            newBotPos[0]++;
            break;
        }

        if (!this.checkPositionInBounds(newBotPos)) {
          bot.track.push(bot.position.slice(0));

          if (bot.track.length > bot.trackLength) {
            bot.track.shift();
          }
          bot.position = newBotPos;
        } else {
          this.botOutOfBounds(bot);
        }

        bot.brain.default.progress++;
        if (
          bot.brain.default.progress >= bot.brain.default.instructions.length
        ) {
          bot.brain.default.progress = 0;
        }
      }
    }

    this.renderOntoMap();
    setTimeout(() => {
      this.simulateStep();
    }, this.simulationSpeed);
  }

  checkPositionInBounds(position: number[]): boolean {
    if (position[0] == null || !position[1] == null) {
      return true;
    }

    if (
      position[0] >= this.battleMapSize[0] ||
      position[0] < 0 ||
      position[1] >= this.battleMapSize[1] ||
      position[1] < 0
    ) {
      return true;
    }
    return false;
  }

  botOutOfBounds(bot: Bot) {
    console.log(`${bot.name} crashed into a wall`);
    bot.crashed = true;
  }

  calculateMoveDirection(dir: Direction, instruction: Instruction): Direction {
    if (instruction == 'forward') {
      return dir;
    } else if (instruction == 'left') {
      if (dir == 'up') {
        return 'left';
      } else if (dir == 'left') {
        return 'down';
      } else if (dir == 'down') {
        return 'right';
      } else if (dir == 'right') {
        return 'up';
      }
    } else if (instruction == 'right') {
      if (dir == 'up') {
        return 'right';
      } else if (dir == 'left') {
        return 'up';
      } else if (dir == 'down') {
        return 'left';
      } else if (dir == 'right') {
        return 'down';
      }
    }
    return dir;
  }

  renderOntoMap() {
    this.battleMapBuffer = this.generateArrayBuffer(
      this.battleMapSize[0] * this.battleMapSize[1]
    );

    for (let i = 0; i < this.battleMapSize[0]; i++) {
      for (let j = 0; j < this.battleMapSize[1]; j++) {
        if (this.simulation.obstacleMap[i][j]) {
          this.setToBattleMapBuffer([i, j], 1);
        }
      }
    }

    for (let bot of this.simulation.bots) {
      this.setToBattleMapBuffer(bot.position, 2);
      //this.simulation.map[bot.position[0]][bot.position[1]].type = 'player';
      //this.simulation.map[bot.position[0]][bot.position[1]].color = bot.color;

      for (let trackElement of bot.track) {
        this.setToBattleMapBuffer(trackElement, 3);
      }
    }
  }

  private setToBattleMapBuffer(pos: number[], value: number) {
    this.battleMapBuffer[pos[0] * this.battleMapSize[0] + pos[1]] = value;
  }

  getBattleMapBufferValue(x: number, y: number): number {
    return this.battleMapBuffer[x * this.battleMapSize[0] + y];
  }

  //isnt very clean but angular cant loop over numbers only collections :(
  fakeArray(length: number): Array<any> {
    if (length >= 0) {
      return new Array(length);
    }
    return new Array(0);
  }

  private changeColorLightness(color: number, lightness: number): number {
    return (
      Math.max(0, Math.min((color & 0xff0000) / 0x10000 + lightness, 0xff)) *
        0x10000 +
      Math.max(0, Math.min((color & 0x00ff00) / 0x100 + lightness, 0xff)) *
        0x100 +
      Math.max(0, Math.min((color & 0x0000ff) + lightness, 0xff))
    );
  }
}
