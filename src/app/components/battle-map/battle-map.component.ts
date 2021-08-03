import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

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
  position: number[];
  color: number;
  track: number[][];
  direction: Direction;
  brain: BrainData;
}

export interface SimulationData {
  bots: Bot[];
  map: TileData[][];
}

@Component({
  selector: 'app-battle-map',
  templateUrl: './battle-map.component.html',
  styleUrls: ['./battle-map.component.scss'],
})
export class BattleMapComponent implements OnInit {
  simulationSpeed = environment.simulationSpeed;
  battleMapSize: number[] = [20, 20];
  emptyTile: TileData = {
    type: 'air',
  };
  battleMap: TileData[][] = this.fill2DArray(
    this.battleMapSize,
    this.emptyTile
  );

  bot: Bot = {
    color: 0x59ffc2,
    position: [10, 0],
    direction: 'up',
    track: [],
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
    color: 0x59ffc2,
    position: [15, 10],
    direction: 'right',
    track: [],
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
        ],
      },
    },
  };

  simulation: SimulationData = {
    bots: [this.bot, this.bot2],
    map: this.battleMap,
  };

  constructor() {}

  ngOnInit(): void {
    this.startSimulation();
    console.log(this.battleMap);
  }

  fill2DArray(size: number[], value: any): any[][] {
    let createdArray = [];
    for (let j = 0; j < size[0]; j++) {
      let row = [];
      for (let i = 0; i < size[1]; i++) {
        row.push(Object.create(value));
      }
      createdArray.push(row);
    }

    return createdArray;
  }

  startSimulation() {
    this.renderOntoMap();
    this.simulateStep();
  }

  simulateStep() {
    for (let bot of this.simulation.bots) {
      let nextInstruction =
        bot.brain.default.instructions[bot.brain.default.progress];
      let movingDirection: Direction = this.calculateMoveDirection(
        bot.direction,
        nextInstruction
      );

      bot.direction = movingDirection;
      switch (movingDirection) {
        case 'down':
          bot.position[1]--;
          break;
        case 'left':
          bot.position[0]--;
          break;
        case 'up':
          bot.position[1]++;
          break;
        case 'right':
          bot.position[0]++;
          break;
      }

      bot.brain.default.progress++;
      if (bot.brain.default.progress >= bot.brain.default.instructions.length) {
        bot.brain.default.progress = 0;
      }
    }

    this.renderOntoMap();
    setTimeout(() => {
      this.simulateStep();
    }, this.simulationSpeed);
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
    for (let bot of this.simulation.bots) {
      this.simulation.map[bot.position[0]][bot.position[1]].type = 'player';
      this.simulation.map[bot.position[0]][bot.position[1]].color = bot.color;

      for (let trackElement of bot.track) {
        console.log(trackElement);
        this.simulation.map[trackElement[0]][trackElement[1]].type = 'track';
        this.simulation.map[trackElement[0]][trackElement[1]].color =
          this.changeColorLightness(bot.color, 0x50);
      }
    }
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
