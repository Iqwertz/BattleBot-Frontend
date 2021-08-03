import { Component, OnInit } from '@angular/core';

export type TileTypes = 'air' | 'wall' | 'player' | 'track';

export interface TileData {
  type: TileTypes;
  color?: string;
}

@Component({
  selector: 'app-battle-map',
  templateUrl: './battle-map.component.html',
  styleUrls: ['./battle-map.component.scss'],
})
export class BattleMapComponent implements OnInit {
  battleMapSize: number[] = [20, 20];
  emptyTile: TileData = {
    type: 'air',
  };
  battleMap: TileData[][] = this.fill2DArray(
    this.battleMapSize,
    this.emptyTile
  );

  constructor() {}

  ngOnInit(): void {
    console.log(this.battleMap);
  }

  fill2DArray(size: number[], value: any): any[][] {
    return Array.from(Array(size[0]), (_) => Array(size[1]).fill(value));
  }
}
