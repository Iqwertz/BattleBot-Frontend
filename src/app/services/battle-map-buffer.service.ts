import { Injectable } from '@angular/core';

/**
 *Service to handle BattlemapBuffer Read/Write Operations
 *
 * @export
 * @class BattleMapBufferService
 */
@Injectable({
  providedIn: 'root',
})
export class BattleMapBufferService {
  battleMapSize: number[] = [];
  battleMapBuffer: Uint8Array = this.generateArrayBuffer(0);

  constructor() {}

  /**
   *Sets a value to the Battlemap buffer from a given 2d postion
   *
   * @param {number[]} pos
   * @param {number} value
   * @memberof BattleMapBufferService
   */
  setToBattleMapBuffer(pos: number[], value: number) {
    this.battleMapBuffer[pos[0] * this.battleMapSize[0] + pos[1]] = value;
  }

  /**
   *gets the Value aat the given Position from the battleMap Buffer
   *
   * @param {number} x
   * @param {number} y
   * @return {*}  {number}
   * @memberof BattleMapBufferService
   */
  getBattleMapBufferValue(x: number, y: number): number {
    return this.battleMapBuffer[x * this.battleMapSize[0] + y];
  }

  /**
   *Clears the BattleMap Buffer by generating a new Buffer
   *
   * @memberof BattleMapBufferService
   */
  clearArrayBuffer() {
    this.battleMapBuffer = this.generateArrayBuffer(
      this.battleMapSize[0] * this.battleMapSize[1]
    );
  }

  /**
   *generates a Uint8Array Buffer with the given size
   *
   * @param {number} bufferSize
   * @return {*}  {Uint8Array}
   * @memberof BattleMapBufferService
   */
  generateArrayBuffer(bufferSize: number): Uint8Array {
    let buffer = new ArrayBuffer(bufferSize);
    let view = new Uint8Array(buffer);

    return view;
  }
}
