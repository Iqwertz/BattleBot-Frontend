import { formatCurrency } from '@angular/common';
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

export type LogicInstructionType = 'if';

export type Direction = 'left' | 'right' | 'up' | 'down';

export type Operator = '==' | '!=';

export type BotVarRef = 'radarLeft' | 'radarRight' | 'radarForward';

export interface LogicTest {
  variable: BotVarRef;
  operator: Operator;
  value: string;
}

export interface LogicInstruction {
  type: LogicInstructionType;
  test: LogicTest;
  whenTrue: InstructionSet;
  else?: InstructionSet;
}

export interface InstructionSet {
  progress: number;
  instructions: (Instruction | LogicInstruction)[];
}

export interface BotVars {
  obstacleRadar: RadarStatus;
}

export interface BrainData {
  vars: BotVars;
  default: InstructionSet;
  onWallDetected: InstructionSet;
  onBorderDetected?: InstructionSet;
}

export interface RadarStatus {
  left: boolean;
  forward: boolean;
  right: boolean;
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
      vars: {
        obstacleRadar: {
          forward: false,
          left: false,
          right: false,
        },
      },
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
      onWallDetected: {
        progress: 0,
        instructions: [],
      },
    },
  };

  bot2: Bot = {
    name: 'Bot2',
    color: 0x59ffc2,
    position: [
      Math.round(this.battleMapSize[0] / 2),
      Math.round(this.battleMapSize[1] / 2),
    ],
    direction: 'left',
    track: [],
    trackLength: 40,
    crashed: false,
    brain: {
      vars: {
        obstacleRadar: {
          forward: false,
          left: false,
          right: false,
        },
      },
      default: {
        progress: 0,
        instructions: [
          'left',
          'forward',
          'forward',
          'left',
          'forward',
          'right',
          'forward',
          'left',
          'forward',
          'right',
          'forward',
          'forward',
          'left',
          'forward',
          'right',
          'forward',
          'forward',
          'right',
          'forward',
          'forward',
          'left',
          'forward',
          'left',
          'forward',
          'left',
          'forward',
          'forward',
          'forward',
          'forward',
          'right',
          'forward',
          'right',
          'forward',
        ],
      },
      onWallDetected: {
        progress: 0,
        instructions: [
          {
            test: {
              operator: '==',
              value: 'true',
              variable: 'radarForward',
            },
            whenTrue: {
              progress: 0,
              instructions: ['left', 'left', 'forward'],
            },
            type: 'if',
          },
          {
            test: {
              operator: '==',
              value: 'true',
              variable: 'radarLeft',
            },
            whenTrue: {
              progress: 0,
              instructions: ['left', 'left', 'forward'],
            },
            type: 'if',
          },
          {
            test: {
              operator: '==',
              value: 'true',
              variable: 'radarRight',
            },
            whenTrue: {
              progress: 0,
              instructions: ['left', 'left', 'forward'],
            },
            type: 'if',
          },
        ],
      },
    },
  };

  simulation: SimulationData = {
    bots: [this.bot2], //this.bot2
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
        this.checkForEvents(bot);

        let nextInstruction = this.getNextInstruction(bot);

        for (let i = 0; i < nextInstruction.length; i++) {
          bot.direction = this.calculateMoveDirection(
            bot.direction,
            nextInstruction[i]
          );
        }

        let movingDirection: Direction = this.calculateMoveDirection(
          bot.direction,
          'forward'
        );

        let newBotPos: number[] = bot.position.slice(0);

        bot.direction = movingDirection;

        switch (movingDirection) {
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

        if (!this.checkPositionOutOfBounds(newBotPos)) {
          bot.track.push(bot.position.slice(0));

          if (bot.track.length > bot.trackLength) {
            bot.track.shift();
          }
          bot.position = newBotPos;
        } else {
          this.botOutOfBounds(bot);
        }
      }
    }

    this.renderOntoMap();
    setTimeout(() => {
      this.simulateStep();
    }, this.simulationSpeed);
  }

  checkIfDirectionInstruction(
    instruction: Instruction | LogicInstruction
  ): instruction is Instruction {
    if (
      instruction === 'forward' ||
      instruction === 'left' ||
      instruction === 'right'
    ) {
      return true;
    }
    return false;
  }

  getNextInstruction(bot: Bot): Instruction[] {
    let eventInstruction = this.checkForEvents(bot);
    if (!eventInstruction) {
      let defaultIn: Instruction[] = [];
      let stepFound = false;
      while (!stepFound) {
        let ins = bot.brain.default.instructions[bot.brain.default.progress];

        if (ins == 'forward') {
          stepFound = true;
        } else if (this.checkIfDirectionInstruction(ins)) {
          defaultIn.push(ins);
        }

        bot.brain.default.progress++;
        if (
          bot.brain.default.progress >= bot.brain.default.instructions.length
        ) {
          bot.brain.default.progress = 0;
          stepFound = true;
        }
      }
      return defaultIn;
    } else {
      return eventInstruction;
    }
  }

  checkForEvents(bot: Bot): Instruction[] | null {
    if (this.checkWalls(bot)) {
      return this.executeLogic(bot.brain.onWallDetected, 0, bot.brain.vars);
    }
    return null;
  }

  checkWalls(bot: Bot): boolean {
    bot.brain.vars.obstacleRadar = {
      left: this.checkWallDir(bot, 'left'),
      right: this.checkWallDir(bot, 'right'),
      forward: this.checkWallDir(bot, 'forward'),
    };

    return (
      bot.brain.vars.obstacleRadar.left ||
      bot.brain.vars.obstacleRadar.right ||
      bot.brain.vars.obstacleRadar.forward
    );
  }

  checkWallDir(bot: Bot, ins: Instruction): boolean {
    let detected = false;
    let relativePos: number[] = this.getRelativePosition(
      bot.direction,
      ins,
      bot.position
    );
    if (this.checkPositionOutOfBounds(relativePos)) {
      detected = true;
    } else if (this.simulation.obstacleMap[relativePos[0]][relativePos[1]]) {
      detected = true;
    }

    return detected;
  }

  checkPositionOutOfBounds(position: number[]): boolean {
    if (position[0] == null || position[1] == null) {
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

  executeLogic(
    instructionSet: InstructionSet,
    progress: number,
    botVariablen: BotVars
  ): Instruction[] {
    let calculatedInstructions: Instruction[] = [];

    for (let i = progress; i < instructionSet.instructions.length; i++) {
      let instruction = instructionSet.instructions[i];
      if (this.checkIfDirectionInstruction(instruction)) {
        if (instruction == 'forward') {
          return calculatedInstructions;
        }
        calculatedInstructions.push(instruction);
      } else {
        if (instruction.type == 'if') {
          if (this.doLogicTest(instruction.test, botVariablen)) {
            let executeResult = this.executeLogic(
              instruction.whenTrue,
              0,
              botVariablen
            );
            calculatedInstructions =
              calculatedInstructions.concat(executeResult);
            console.log(calculatedInstructions);
          } else if (instruction.else != undefined) {
            let executeResult = this.executeLogic(
              instruction.else!,
              0,
              botVariablen
            );
            calculatedInstructions =
              calculatedInstructions.concat(executeResult);
          }
        }
      }
    }

    return calculatedInstructions;
  }

  doLogicTest(test: LogicTest, botVars: BotVars): boolean {
    const variable = this.getBotVarFromRef(botVars, test.variable);
    if (test.operator == '==') {
      if (variable == test.value) {
        return true;
      } else {
        return false;
      }
    } else if (test.operator == '!=') {
      if (variable != test.value) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  getBotVarFromRef(bVar: BotVars, ref: BotVarRef): string {
    if (ref == 'radarForward') {
      return bVar.obstacleRadar.forward.toString();
    } else if (ref == 'radarLeft') {
      return bVar.obstacleRadar.left.toString();
    } else if (ref == 'radarRight') {
      return bVar.obstacleRadar.right.toString();
    }

    return '';
  }

  getRelativePosition(
    dir: Direction,
    ins: Instruction,
    position: number[]
  ): number[] {
    let calcDir: Direction = this.calculateMoveDirection(dir, ins);
    let calcPos = position.slice(0);
    if (calcDir == 'up') {
      calcPos[0]--;
    } else if (calcDir == 'left') {
      calcPos[1]--;
    } else if (calcDir == 'down') {
      calcPos[0]++;
    } else if (calcDir == 'right') {
      calcPos[1]++;
    }

    return calcPos;
  }

  calculateMoveDirection(dir: Direction, instruction: Instruction): Direction {
    if (instruction == 'forward') {
      return dir;
    } else if (instruction == 'left') {
      return this.getLeftDirection(dir);
    } else if (instruction == 'right') {
      return this.getRightDirection(dir);
    }
    return dir;
  }

  getRightDirection(dir: Direction): Direction {
    if (dir == 'up') {
      return 'right';
    } else if (dir == 'left') {
      return 'up';
    } else if (dir == 'down') {
      return 'left';
    } else if (dir == 'right') {
      return 'down';
    }
    return dir; //only for ts this return cant be reched
  }

  getLeftDirection(dir: Direction): Direction {
    if (dir == 'up') {
      return 'left';
    } else if (dir == 'left') {
      return 'down';
    } else if (dir == 'down') {
      return 'right';
    } else if (dir == 'right') {
      return 'up';
    }

    return dir; //only for ts this return cant be reched
  }

  invertDirection(dir: Direction): Direction {
    if (dir == 'down') {
      return 'up';
    } else if (dir == 'up') {
      return 'down';
    } else if (dir == 'left') {
      return 'right';
    } else if (dir == 'right') {
      return 'left';
    }

    return dir; //only for ts this return cant be reched
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
