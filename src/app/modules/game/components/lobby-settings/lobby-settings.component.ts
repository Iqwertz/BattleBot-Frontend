import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { SimulationService } from '../../../../services/simulation/simulation.service';
import { LobbyRefSettings } from '../../../../services/firebase/firebase-lobby.service';

@Component({
  selector: 'app-lobby-settings',
  templateUrl: './lobby-settings.component.html',
  styleUrls: ['./lobby-settings.component.scss'],
})
export class LobbySettingsComponent implements OnInit {
  maxPlayer: number = environment.maxPlayer;

  maxTime: number = environment.maxTime;

  modes: string[] = ['Color'];

  maxMapSize: number = environment.maxMapSize;

  obstacleMaxSettings: any = environment.obstacleMaxNoiseSettings;

  @Input('isAdmin') isAdmin = false;

  @Input('currentPlayer') currentPlayer = 1;

  lobbySettings: LobbyRefSettings | undefined;
  @Input() set setLobbySettings(ls: LobbyRefSettings | undefined) {
    this.lobbySettings = ls;
    this.updateMap();
  }

  @Output() lobbySettingChange = new EventEmitter<LobbyRefSettings>();

  constructor(private simulationService: SimulationService) {}

  ngOnInit(): void {
    console.log('settings init');
    this.updateMap();
  }

  validatePlayer() {
    if (this.lobbySettings) {
      if (this.lobbySettings.maxPlayer > this.maxPlayer) {
        this.lobbySettings.maxPlayer = this.maxPlayer;
      } else if (this.lobbySettings.maxPlayer < this.currentPlayer) {
        this.lobbySettings.maxPlayer = this.currentPlayer;
      }
    }
  }

  validateTime() {
    if (this.lobbySettings) {
      if (this.lobbySettings.simulationTime > this.maxTime) {
        this.lobbySettings.simulationTime = this.maxTime;
      } else if (this.lobbySettings.simulationTime < 1) {
        this.lobbySettings.simulationTime = 1;
      }

      if (this.lobbySettings.editorTime > this.maxTime) {
        this.lobbySettings.editorTime = this.maxTime;
      } else if (this.lobbySettings.editorTime < 1) {
        this.lobbySettings.editorTime = 1;
      }
    }
  }

  validateMap() {
    if (this.lobbySettings) {
      if (this.lobbySettings.mapSize > this.maxMapSize) {
        this.lobbySettings.mapSize = this.maxMapSize;
      } else if (this.lobbySettings.mapSize < 1) {
        this.lobbySettings.mapSize = 1;
      }

      this.updateMap();
    }
  }

  updateMap() {
    if (this.lobbySettings) {
      console.log('update');
      if (!this.lobbySettings.obstacles) {
        this.lobbySettings.obstacleSettings.threshold = 1;
      }
      this.simulationService.generateNewSimulation(
        [this.lobbySettings.mapSize, this.lobbySettings.mapSize],
        false,
        this.lobbySettings.obstacles,
        this.lobbySettings.obstacleSettings
      );

      this.simulationService.setSpeed(this.lobbySettings.speed);

      // this.simulationService.setRandomBot();

      // this.simulationService.start();
    }
  }

  settingChanged() {
    if (this.lobbySettings) {
      this.lobbySettingChange.emit(this.lobbySettings);
    }
  }
}
