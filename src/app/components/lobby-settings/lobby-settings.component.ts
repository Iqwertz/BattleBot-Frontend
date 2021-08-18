import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SimulationService } from '../../services/simulation.service';

@Component({
  selector: 'app-lobby-settings',
  templateUrl: './lobby-settings.component.html',
  styleUrls: ['./lobby-settings.component.scss'],
})
export class LobbySettingsComponent implements OnInit {
  name: string = '';
  player: number = 2;
  maxPlayer: number = environment.maxPlayer;
  isPrivate: boolean = false;

  simulationTime: number = 5;
  editingTime: number = 10;

  maxTime: number = environment.maxTime;

  modes: string[] = ['Color'];
  selectedMode: string = this.modes[0];

  speed: number = 1;

  map: number = environment.defaultMapSize[0];
  maxMapSize: number = environment.maxMapSize;

  obstacles: boolean = true;

  obstacleSettings: any = environment.obstacleNoiseSettings;
  obstacleMaxSettings: any = environment.obstacleMaxNoiseSettings;

  constructor(private simulationService: SimulationService) {}

  ngOnInit(): void {
    this.updateMap();
  }

  validatePlayer() {
    if (this.player > this.maxPlayer) {
      this.player = this.maxPlayer;
    } else if (this.player < 2) {
      this.player = 2;
    }
  }

  validateTime() {
    if (this.simulationTime > this.maxTime) {
      this.simulationTime = this.maxTime;
    } else if (this.simulationTime < 1) {
      this.simulationTime = 1;
    }

    if (this.editingTime > this.maxTime) {
      this.editingTime = this.maxTime;
    } else if (this.editingTime < 1) {
      this.editingTime = 1;
    }
  }

  validateMap() {
    if (this.map > this.maxMapSize) {
      this.map = this.maxMapSize;
    } else if (this.map < 1) {
      this.map = 1;
    }

    this.updateMap();
  }

  updateMap() {
    console.log('update');
    if (!this.obstacles) {
      this.obstacleSettings.threshold = 1;
    }
    this.simulationService.generateNewSimulation(
      [this.map, this.map],
      false,
      this.obstacleSettings
    );

    this.simulationService.setSpeed(this.speed);

    this.simulationService.setRandomBot();

    this.simulationService.start();
  }
}
