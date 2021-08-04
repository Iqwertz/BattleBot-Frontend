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
  name: string;
  position: number[];
  color: number;
  track: number[][];
  direction: Direction;
  brain: BrainData;
  crashed: boolean;
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
  battleMapSize: number[] = [50, 50];
  emptyTile: TileData = {
    type: 'air',
  };
  emptyMap: TileData[][] = this.fill2DArray(this.battleMapSize, this.emptyTile);
  battleMap: TileData[][] = this.emptyMap.slice(0);

  bot: Bot = {
    name: 'Bot1',
    color: 0x59ffc2,
    position: [this.battleMapSize[0] - 1, 0],
    direction: 'up',
    track: [],
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
    this.clearMapArray();
    this.simulateStep();
  }

  simulateStep() {
    this.clearMapArray();
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
    //this.simulation.map = this.emptyMap;

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

  private clearMapArray() {
    if (typeof Worker !== 'undefined') {
      // Create a new
      const worker = new Worker(new URL('./deep-copy.worker', import.meta.url));
      worker.onmessage = ({ data }) => {
        this.emptyMap = data;
      };
      worker.postMessage({
        size: this.battleMapSize,
        value: this.emptyTile,
      });
    } else {
      console.log('Worker not available');
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
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
