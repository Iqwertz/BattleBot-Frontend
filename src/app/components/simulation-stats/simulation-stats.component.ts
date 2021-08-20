import { environment } from './../../../environments/environment';
import { SimulationService } from './../../services/simulation.service';
import { SimulationStatsService } from './../../services/simulation-stats.service';
import { Component, OnInit } from '@angular/core';
import { AppState } from '../../store/app.state';
import { LobbyRef } from '../../services/firebase-lobby.service';
import { Select } from '@ngxs/store';
import { maxBy, round } from 'lodash';

@Component({
  selector: 'app-simulation-stats',
  templateUrl: './simulation-stats.component.html',
  styleUrls: ['./simulation-stats.component.scss'],
})
export class SimulationStatsComponent implements OnInit {
  byteColorMap = new Map(Object.entries(environment.byteColorMap));

  @Select(AppState.currentLobby) currentLobby$: any;
  currentLobby: LobbyRef | undefined;

  progress: string = '-%';

  constructor(
    public simulationStatsService: SimulationStatsService,
    public simulationService: SimulationService
  ) {}

  ngOnInit(): void {
    this.currentLobby$.subscribe((newLobby: LobbyRef | undefined) => {
      this.currentLobby = newLobby;
      console.log(this.currentLobby!.settings.simulationSteps);
    });

    this.simulationService.stepCalculated.subscribe(() => {
      this.calcProgress();
    });
  }

  calcProgress() {
    let steps = this.simulationService.simulation.statusVar.simulatedSteps;
    let maxSteps = this.currentLobby!.settings.simulationSteps;
    if (this.currentLobby && maxSteps > 0) {
      console.log(steps);
      console.log(maxSteps);

      this.progress = round((steps * 100) / maxSteps, 0) + '%';

      if (steps >= maxSteps) {
        this.simulationService.pause();
        this.simulationStatsService.setWinner();
      }
    }
  }
}
