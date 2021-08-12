import { SetPlacingBot } from './../../store/app.action';
import { AppState } from './../../store/app.state';
import { Select, Store } from '@ngxs/store';
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

  @Select(AppState.placingBot) placingBot$: any;
  placingBot: boolean = false;

  @Select(AppState.compiledBot) compiledBot$: any;
  compiledBot: Bot | undefined;

  constructor(
    private battleMapBufferService: BattleMapBufferService,
    public simulationService: SimulationService,
    private store: Store,
  ) { }

  ngOnInit(): void {

    this.placingBot$.subscribe((val: boolean) => {
      this.placingBot = val;
    })


    this.compiledBot$.subscribe((bot: Bot) => {
      this.compiledBot = bot;
    })

    this.simulationService.generateNewSimulation([50, 50]);
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

  tileSelected(x: number, y: number) {
    if (this.placingBot && this.compiledBot) {
      this.compiledBot.position = [x, y];
      this.simulationService.setBot(this.compiledBot);
      this.store.dispatch(new SetPlacingBot(false));
    }
  }
}
