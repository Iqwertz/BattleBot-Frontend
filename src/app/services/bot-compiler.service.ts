import { Injectable } from '@angular/core';
import { BattleMapBufferService } from './battle-map-buffer.service';
import {
  Bot,
  SimulationData,
} from '../components/battle-map/battle-map.component';

//available Instructions, Instructions are relativew to the bots facing direction
export type Instruction = 'forward' | 'left' | 'right';

//available instruction Types
export type LogicInstructionType = 'if';

//available directions, Directions are absolute (not affected by the bots facing direction)
export type Direction = 'left' | 'right' | 'up' | 'down';

// available operator
export const _Operators = ['==', '!='] as const;
export type Operator = typeof _Operators[number];

//references to the bot variables, is decoded in the getBotVarFromRef() function
export const _BotVars = [
  'radarLeft',
  'radarRight',
  'radarForward',
  'trackRadarLeft',
  'trackRadarRight',
  'trackRadarForward',
] as const;
export type BotVarRef = typeof _BotVars[number];

// a logic test  (like x == y),
export interface LogicTest {
  variable: BotVarRef;
  operator: Operator;
  value: string;
}

//a logic instruction , whenTrue is executed when the test is true, else when not.
export interface LogicInstruction {
  type: LogicInstructionType;
  test: LogicTest;
  whenTrue: InstructionSet;
  else?: InstructionSet;
}

//a set of instructions, can have logic instructions,
export interface InstructionSet {
  progress?: number;
  instructions: (Instruction | LogicInstruction)[];
}

//all variables of a bot that are available to the compiler
export interface BotVars {
  obstacleRadar: RadarStatus;
  trackRadar: RadarStatus;
}

//all Brain Callbyacks
export type BrainFunctions = 'default' | 'onWallDetected' | 'onTrackDetected';

//Data of a bots Brain, on.. are callbacks for events
export interface BrainData {
  vars: BotVars;
  default: InstructionSet;
  onWallDetected: InstructionSet;
  onTrackDetected: InstructionSet;
}

//the directional Status Values of a radar
export interface RadarStatus {
  left: boolean;
  forward: boolean;
  right: boolean;
}

export const emptyRadar: RadarStatus = {
  forward: false,
  left: false,
  right: false,
};

export const defaultBotVars: BotVars = {
  obstacleRadar: emptyRadar,
  trackRadar: emptyRadar,
};

/**
 *This Service handles all the compiler logic of a bot.
 *
 * @export
 * @class BotCompilerService
 */
@Injectable({
  providedIn: 'root',
})
export class BotCompilerService {
  constructor(private battleMapBufferService: BattleMapBufferService) {}
  battleMapSize: number[] = [];
  simulation: SimulationData = {
    bots: new Map(),
    obstacleMap: [],
  };

  /**
   * checks if the given parameter is an Instructio or a Logic Instruction, Returns True when it is an Instruction
   *
   * @param {any} instruction
   * @return {*}  {instruction is Instruction}
   * @memberof BotCompilerService
   */
  checkIfDirectionInstruction(instruction: any): instruction is Instruction {
    if (
      instruction === 'forward' ||
      instruction === 'left' ||
      instruction === 'right'
    ) {
      return true;
    }
    return false;
  }

  /**
   * checks if the given parameter is an Instruction or a Logic Instruction, Returns True when it is an Instruction
   *
   * @param {any} instruction has to be a instruction type (instruction.type)
   * @return {*}  {instruction is LogicInstruction}
   * @memberof BotCompilerService
   */
  checkIfLogicInstruction(instruction: any): instruction is LogicInstruction {
    if (instruction == 'if') {
      return true;
    }
    return false;
  }

  /**
   *calculates the NextInstruction for a Bot and returns it
   *
   * @param {Bot} bot
   * @return {*}  {Instruction[]}
   * @memberof BotCompilerService
   */
  getNextInstruction(bot: Bot): Instruction[] {
    let eventInstruction = this.checkForEvents(bot); //checks for event instructions
    if (!eventInstruction) {
      //when no eventInstruction was triggerd get next default instructions
      let defaultIn: Instruction[] = [];
      let stepFound = false;
      while (!stepFound) {
        //gets all functions until there is a step found ('forward')
        if (bot.brain.default.progress == undefined) {
          //type guard
          bot.brain.default.progress = 0;
        }
        let ins = bot.brain.default.instructions[bot.brain.default.progress]; //get instruction

        if (ins == 'forward') {
          //check if it is a step
          stepFound = true;
        } else if (this.checkIfDirectionInstruction(ins)) {
          //if not add instruction to defaultIn(structions)
          defaultIn.push(ins);
        }

        bot.brain.default.progress++; //increment progress
        if (
          bot.brain.default.progress >= bot.brain.default.instructions.length
        ) {
          //reset progress when no instruction left to loop
          bot.brain.default.progress = 0;
          stepFound = true;
        }
      }
      return defaultIn;
    } else {
      return eventInstruction;
    }
  }

  /**
   *checks for Events and executes the Callback if detected, returns the calculated instructions
   *
   * @param {Bot} bots
   * @return {*}  {(Instruction[] | null)} - calculated Callback Instructions, null if no Event was fired
   * @memberof BotCompilerService
   */
  checkForEvents(bot: Bot): Instruction[] | null {
    if (this.checkWalls(bot)) {
      //check for walls
      return this.executeLogic(bot.brain.onWallDetected, 0, bot.brain.vars); //callback
    } else if (this.checkTracks(bot)) {
      //check for tracks
      return this.executeLogic(bot.brain.onTrackDetected, 0, bot.brain.vars); //callback
    }
    return null;
  }

  /**
   *checks the fields around the bot (forward, left, right) and updates the bots internal trackRadar
   *
   * @param {Bot} bot
   * @return {*}  {boolean} - true when any track was found
   * @memberof BotCompilerService
   */
  checkTracks(bot: Bot): boolean {
    bot.brain.vars.trackRadar = {
      left: this.checkTrackDir(bot, 'left'),
      right: this.checkTrackDir(bot, 'right'),
      forward: this.checkTrackDir(bot, 'forward'),
    };

    return (
      bot.brain.vars.trackRadar.left ||
      bot.brain.vars.trackRadar.right ||
      bot.brain.vars.trackRadar.forward
    );
  }

  /**
   *checks the fields around the bot (forward, left, right) and updates the bots internal radar
   *
   * @param {Bot} bot
   * @return {*}  {boolean} - true when any obstacle was found
   * @memberof BotCompilerService
   */
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

  /**
   *checks a tile in the given direction from the bot for an enemy track tile
   *
   * @param {Bot} bot
   * @param {Instruction} ins - direction to check
   * @return {*}  {boolean} - true when track was found in the direction
   * @memberof BotCompilerService
   */
  checkTrackDir(bot: Bot, ins: Instruction): boolean {
    let detected = false;
    let absolutePos: number[] = this.getRelativePosition(
      bot.direction,
      ins,
      bot.position
    ); //get absoulte position of the checked tile
    if (!this.checkPositionOutOfBounds(absolutePos)) {
      //check if tile is in bounds
      let posVal = this.battleMapBufferService.getBattleMapBufferValue(
        absolutePos[0],
        absolutePos[1]
      ); //get the value of the tile
      if (posVal != bot.trackColor) {
        //check if it is not the own track
        if (
          //check if it is na enemy Player track
          this.isPlayerTrackByte(
            this.battleMapBufferService.getBattleMapBufferValue(
              absolutePos[0],
              absolutePos[1]
            )
          )
        ) {
          detected = true;
        }
      }
    }

    return detected;
  }

  /**
   *checks if a given byte is a player track color
   *
   * @param {number} b
   * @return {*}  {boolean} - true when it is a player track byte
   * @memberof BotCompilerService
   */
  isPlayerTrackByte(b: number): boolean {
    for (let k of this.simulation.bots.keys()) {
      //get player colors
      if (b == k + 1) {
        //check if it is player byte +1 (track colors are always playerbyte++)
        return true;
      }
    }
    return false;
  }

  /**
   *checks a tile in the given direction from the bot for an obstacle
   *
   * @param {Bot} bot
   * @param {Instruction} ins - direction to check
   * @return {*}  {boolean} - true when track was found in the direction
   * @memberof BotCompilerService
   */
  checkWallDir(bot: Bot, ins: Instruction): boolean {
    let detected = false;
    let absoultePos: number[] = this.getRelativePosition(
      bot.direction,
      ins,
      bot.position
    ); //get absoulte position of the checked tile
    if (this.checkPositionOutOfBounds(absoultePos)) {
      //check if out of bounds
      detected = true;
    } else if (this.simulation.obstacleMap[absoultePos[0]][absoultePos[1]]) {
      //check if entry on obstacle Map
      detected = true;
    }

    return detected;
  }

  /**
   *checks if a given is not in the map
   *
   * @param {number[]} position
   * @return {*}  {boolean} - true when out of bounds
   * @memberof BotCompilerService
   */
  checkPositionOutOfBounds(position: number[]): boolean {
    if (position[0] == null || position[1] == null) {
      //check if position is valid
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

  /**
   *executes a instruction set and performs logic checks if it is a logicInstruction, is called recursivly when nested logic checks are used
   *
   * @param {InstructionSet} instructionSet -the instruction set to execute
   * @param {number} progress - progress (optional) currently not really needed
   * @param {BotVars} botVariablen - variables of the bot to perform logic Instructions
   * @return {*}  {Instruction[]} - calculated instruction set
   * @memberof BotCompilerService
   */
  executeLogic(
    instructionSet: InstructionSet,
    progress: number,
    botVariablen: BotVars
  ): Instruction[] {
    let calculatedInstructions: Instruction[] = [];

    for (let i = progress; i < instructionSet.instructions.length; i++) {
      //loop through the instructions in the instruction Set
      let instruction = instructionSet.instructions[i];
      if (this.checkIfDirectionInstruction(instruction)) {
        //check if it is a direction
        if (instruction == 'forward') {
          //check if it is a step
          return calculatedInstructions; //stop calculation since a step was found
        }
        calculatedInstructions.push(instruction); //add instruction to the calculated Instructions
      } else {
        //when logic instruction
        if (instruction.type == 'if') {
          // when it is an if check
          if (this.doLogicTest(instruction.test, botVariablen)) {
            //do the logic test
            let executeResult = this.executeLogic(
              instruction.whenTrue,
              0,
              botVariablen
            ); //calculate Logic of the instruction set when true;
            calculatedInstructions =
              calculatedInstructions.concat(executeResult); //add results to the calculated instructions
          } else if (instruction.else != undefined) {
            //check if there is a else callback
            let executeResult = this.executeLogic(
              instruction.else!,
              0,
              botVariablen
            ); //calculate else Logic
            calculatedInstructions =
              calculatedInstructions.concat(executeResult); //add results to the calculated instructions
          }
        }
      }
    }

    return calculatedInstructions;
  }

  /**
   *Performs a Logic test with the passed Variables and the test information
   *
   * @param {LogicTest} test - data of the test to perform
   * @param {BotVars} botVars - the variables of the bot
   * @return {*}  {boolean} - test results
   * @memberof BotCompilerService
   */
  doLogicTest(test: LogicTest, botVars: BotVars): boolean {
    const variable = this.getBotVarFromRef(botVars, test.variable); // get the var value from the test reference
    if (test.operator == '==') {
      //check if equal operator
      if (variable == test.value) {
        //test if var equals checked value
        return true;
      } else {
        return false;
      }
    } else if (test.operator == '!=') {
      //Check if not equal operator
      if (variable != test.value) {
        //test if var in not value
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  /**
   *returns the value of the botVariable by its reference
   *
   * @param {BotVars} bVar
   * @param {BotVarRef} ref
   * @return {*}  {string}
   * @memberof BotCompilerService
   */
  getBotVarFromRef(bVar: BotVars, ref: BotVarRef): string {
    if (ref == 'radarForward') {
      return bVar.obstacleRadar.forward.toString();
    } else if (ref == 'radarLeft') {
      return bVar.obstacleRadar.left.toString();
    } else if (ref == 'radarRight') {
      return bVar.obstacleRadar.right.toString();
    } else if (ref == 'trackRadarForward') {
      return bVar.trackRadar.forward.toString();
    } else if (ref == 'trackRadarLeft') {
      return bVar.trackRadar.left.toString();
    } else if (ref == 'trackRadarRight') {
      return bVar.trackRadar.right.toString();
    }

    return '';
  }

  /**
   *gets the absolute position relative to the current bot direction
   *
   * @param {Direction} dir - direction the bot is facing
   * @param {Instruction} ins - the direction to check
   * @param {number[]} position - current bot position
   * @return {*}  {number[]} - the calculated absolute position
   * @memberof BotCompilerService
   */
  getRelativePosition(
    dir: Direction,
    ins: Instruction,
    position: number[]
  ): number[] {
    let calcDir: Direction = this.calculateMoveDirection(dir, ins); //calculate the absolute direction
    let calcPos = position.slice(0); //get cvopy of the positon
    if (calcDir == 'up') {
      //change position depending on the direction
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

  /**
   *calculates the absolute direction based on a direction and an instruction
   *
   * @param {Direction} dir - the current direction
   * @param {Instruction} instruction - the instruction (turning direction)
   * @return {*}  {Direction} - the absolute direction
   * @memberof BotCompilerService
   */
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

  /**
   *gets the clockwise direction of the passed direction
   *
   * @param {Direction} dir
   * @return {*}  {Direction}
   * @memberof BotCompilerService
   */
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

  /**
   *gets the counterclockwise direction of the passed direction
   *
   * @param {Direction} dir
   * @return {*}  {Direction}
   * @memberof BotCompilerService
   */
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

  /**
   *inverts the passed direction
   *
   * @param {Direction} dir
   * @return {*}  {Direction}
   * @memberof BotCompilerService
   */
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
}
