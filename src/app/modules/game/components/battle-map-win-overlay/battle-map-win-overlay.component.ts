import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { AppState } from '../../../../store/app.state';
import {
  LobbyRef,
  GameEntry,
} from '../../../../services/firebase/firebase-lobby.service';
import { SimulationStatsService } from '../../../../services/simulation/simulation-stats.service';
import { SimulationService } from '../../../../services/simulation/simulation.service';
import { ConfettiService } from '../../../../services/confetti.service';
import { FirebaseService } from '../../../../services/firebase/firebase.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { SetPlacingBot } from '../../../../store/app.action';

@Component({
  selector: 'app-battle-map-win-overlay',
  templateUrl: './battle-map-win-overlay.component.html',
  styleUrls: ['./battle-map-win-overlay.component.scss'],
})
export class BattleMapWinOverlayComponent implements OnInit {
  @Select(AppState.currentLobby) currentLobby$: any;
  currentLobby: LobbyRef | undefined;

  @Select(AppState.firebaseUser) firebaseUser$: any;
  firebaseUser: any;

  showWinner = false;
  enableRestart = false;

  constructor(
    public simulationStatsService: SimulationStatsService,
    public simulationService: SimulationService,
    private confettiService: ConfettiService,
    private firebaseService: FirebaseService,
    private db: AngularFireDatabase,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.simulationStatsService.winEvent.subscribe(() => {
      this.showWinner = true;
      this.confettiService.setConfetti();
      setTimeout(() => {
        this.confettiService.setConfetti();
      }, 1000);
      setTimeout(() => {
        this.confettiService.setConfetti();
      }, 2000);
      setTimeout(() => {
        this.confettiService.setConfetti();
        this.enableRestart = true;
      }, 3000);
    });

    this.currentLobby$.subscribe((newLobby: LobbyRef | undefined) => {
      this.currentLobby = newLobby;
      if (this.currentLobby) {
        this.checkForRestart();
      }
    });
    this.firebaseUser$.subscribe((user: any) => {
      this.firebaseUser = user;
    });
  }

  checkForRestart() {
    console.log(this.currentLobby?.settings.id);

    let gameFirebaseRef = this.db
      .object('games/' + this.currentLobby?.settings.id)
      .valueChanges();
    let subRef = gameFirebaseRef.subscribe((changes: any) => {
      console.log(changes);
      if (changes && this.showWinner) {
        let pos: number[] = changes.playerBots[this.firebaseUser.uid].position;

        if (pos[0] == 0 && pos[1] == 0) {
          //console.log('reload');
          window.location.reload();
        }
      }
    });
  }

  restart() {
    this.firebaseService.setGame();
    this.firebaseService.resetBotPositions();
  }
}
