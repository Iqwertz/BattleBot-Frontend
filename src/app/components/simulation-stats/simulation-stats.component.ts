import { environment } from './../../../environments/environment';
import { SimulationService } from './../../services/simulation.service';
import { SimulationStatsService } from './../../services/simulation-stats.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-simulation-stats',
  templateUrl: './simulation-stats.component.html',
  styleUrls: ['./simulation-stats.component.scss']
})
export class SimulationStatsComponent implements OnInit {

  byteColorMap = new Map(Object.entries(environment.byteColorMap));

  constructor(public simulationStatsService: SimulationStatsService, public simulationService: SimulationService) { }

  ngOnInit(): void {
  }

}
