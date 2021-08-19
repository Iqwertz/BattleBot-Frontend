import { BattleMapBufferService } from './battle-map-buffer.service';
import { SimulationService } from './simulation.service';
import { Injectable } from '@angular/core';

export interface SimulationStatistic {
  wholeArea: number;
  playerCoverdArea: number;
  playerCoverdAreaPercent: number;
  obstacleCoverdArea: number;
  obstacleCoverdAreaPercent: number;
  emptyArea: number;
  emptyAreaPercent: number;
  playerColors: PlayerColorStat[];
}

export interface PlayerColorStat {
  color: number;
  coverdArea: number;
  coverdAreaPercent: number;
}

@Injectable({
  providedIn: 'root'
})
export class SimulationStatsService {

  simulationStatistics: SimulationStatistic = {
    emptyArea: 0,
    emptyAreaPercent: 0,
    obstacleCoverdArea: 0,
    obstacleCoverdAreaPercent: 0,
    playerCoverdArea: 0,
    playerCoverdAreaPercent: 0,
    wholeArea: 0,
    playerColors: []
  }

  constructor(private battleMapBufferService: BattleMapBufferService) { }

  updateStats() {

    this.simulationStatistics = {
      emptyArea: 0,
      emptyAreaPercent: 0,
      obstacleCoverdArea: 0,
      obstacleCoverdAreaPercent: 0,
      playerCoverdArea: 0,
      playerCoverdAreaPercent: 0,
      wholeArea: 0,
      playerColors: []
    }

    let buffer = this.battleMapBufferService.battleMapBuffer;
    let size = this.battleMapBufferService.battleMapBuffer.length;

    this.simulationStatistics.wholeArea = size;

    for (let i = 0; i < size; i++) {
      if (buffer[i] == 0) {
        this.simulationStatistics.emptyArea++;
      } else if (buffer[i] == 1) {
        this.simulationStatistics.obstacleCoverdArea++;
      } else {
        let foundColor: boolean = false;
        let pColor = buffer[i];
        if (pColor % 2 == 0) {
          pColor--;
        }

        for (let p of this.simulationStatistics.playerColors) {
          if (p.color == pColor) {
            p.coverdArea++;
            foundColor = true;
          }
        }

        if (!foundColor) {
          this.simulationStatistics.playerColors.push({ color: pColor, coverdArea: 1, coverdAreaPercent: 0 })
        }

        this.simulationStatistics.playerCoverdArea++;
      }
    }

    this.calculatePercent();

    this.simulationStatistics.playerColors = this.simulationStatistics.playerColors.sort((a, b) => b.coverdArea - a.coverdArea)
  }

  private calculatePercent() {
    let area = this.simulationStatistics.wholeArea

    this.simulationStatistics.emptyAreaPercent = this.simulationStatistics.emptyArea * 100 / area;
    this.simulationStatistics.obstacleCoverdAreaPercent = this.simulationStatistics.obstacleCoverdArea * 100 / area;
    this.simulationStatistics.playerCoverdAreaPercent = this.simulationStatistics.playerCoverdArea * 100 / area;

    for (let p of this.simulationStatistics.playerColors) {
      p.coverdAreaPercent = p.coverdArea * 100 / area;
    }
  }
}