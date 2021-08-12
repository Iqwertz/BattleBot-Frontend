import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { defaultBots } from './battle-map-bots';
import { BattleMapBufferService } from '../../services/battle-map-buffer.service';
import { BrainData, Direction } from '../../services/bot-compiler.service';
import { SimulationService } from '../../services/simulation.service';

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
  byteColorMap = new Map(Object.entries(environment.byteColorMap));

  constructor(
    private battleMapBufferService: BattleMapBufferService,
    public simulationService: SimulationService
  ) {}

  ngOnInit(): void {
    this.simulationService.generateNewSimulation([50, 50]);
    this.simulationService.setBot(defaultBots[0]);
    this.simulationService.setBot(defaultBots[1]);
    this.simulationService.setBot(defaultBots[2]);
    this.simulationService.start();
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
}
