import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SimulationStatsService } from '../../services/simulation-stats.service';
import { SimulationService } from '../../services/simulation.service';
import { environment } from '../../../environments/environment';
import { Select, Store } from '@ngxs/store';
import { AppState } from '../../store/app.state';
import { LobbyRef } from '../../services/firebase-lobby.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { ConfettiService } from '../../services/confetti.service';

@Component({
  selector: 'app-simulation-leaderboard',
  templateUrl: './simulation-leaderboard.component.html',
  styleUrls: ['./simulation-leaderboard.component.scss'],
})
export class SimulationLeaderboardComponent implements OnInit {
  byteColorMap = new Map(Object.entries(environment.byteColorMap));
  enableRestart: boolean = true;

  @Select(AppState.currentLobby) currentLobby$: any;
  currentLobby: LobbyRef | undefined;

  @Select(AppState.firebaseUser) firebaseUser$: any;
  firebaseUser: any;

  constructor(
    public simulationStatsService: SimulationStatsService,
    public simulationService: SimulationService,
    private confettiService: ConfettiService
  ) {}

  ngOnInit(): void {
    this.simulationStatsService.winEvent.subscribe(() => {
      this.enableRestart = true;
    });

    this.currentLobby$.subscribe((newLobby: LobbyRef | undefined) => {
      this.currentLobby = newLobby;
    });
    this.firebaseUser$.subscribe((user: any) => {
      this.firebaseUser = user;
    });
  }

  restart() {
    //this.enableRestart = false;
    this.confettiService.setConfetti();
    /*     if (this.currentLobby) {
      if (this.firebaseUser.uid == this.currentLobby.adminUid) {
        this.db.database
          .ref()
          .child('/games/' + this.currentLobby.settings.id)
          .child('obstacleMap')
          .update(
            this.simulationService.generateObstacleMap(
              [
                this.currentLobby.settings.mapSize,
                this.currentLobby.settings.mapSize,
              ],
              this.currentLobby.settings.obstacles,
              this.currentLobby.settings.obstacleSettings
            )
          )
          .then(() => {});
      }
    } */
  }
}
