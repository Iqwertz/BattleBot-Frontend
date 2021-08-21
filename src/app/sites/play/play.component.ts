import { Component, OnInit } from '@angular/core';
import { SimulationService } from '../../services/simulation.service';
import {
  GameEntry,
  LobbyRef,
  ObstacleSettings,
} from '../../services/firebase-lobby.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Select, Store } from '@ngxs/store';
import { AppState } from '../../store/app.state';
import {
  SetPlacingBot,
  SetEditing,
  SetCurrentLobby,
} from '../../store/app.action';
import { Bot } from '../../components/battle-map/battle-map.component';
import { Player } from '../../services/firebase-lobby.service';

@Component({
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
})
export class PlayComponent implements OnInit {
  @Select(AppState.currentLobby) currentLobby$: any;
  currentLobby: LobbyRef | undefined;

  @Select(AppState.firebaseUser) firebaseUser$: any;
  firebaseUser: any;

  game: GameEntry | undefined;

  placedBots: string[] = [];

  allBotsPlaced: boolean = false;

  constructor(
    private simulationService: SimulationService,
    private db: AngularFireDatabase,
    private store: Store
  ) {
    /*
    simulationService.generateNewSimulation([150, 150], false, true);
    simulationService.setRandomBot();
    simulationService.setRandomBot();
    simulationService.setRandomBot();
    simulationService.setRandomBot();
    simulationService.setRandomBot();
    simulationService.setRandomBot();
    simulationService.setRandomBot();
    simulationService.setRandomBot();
    simulationService.start(); */

    this.currentLobby$.subscribe((newLobby: LobbyRef | undefined) => {
      this.currentLobby = newLobby;
      if (this.currentLobby) {
        db.database
          .ref()
          .child('/games/' + this.currentLobby.settings.id)
          .get()
          .then((snap) => {
            if (snap.exists() && this.currentLobby) {
              this.game = snap.val();
              if (this.game) {
                this.simulationService.generateNewSimulation(
                  [
                    this.currentLobby.settings.mapSize,
                    this.currentLobby.settings.mapSize,
                  ],
                  this.currentLobby.settings.mode != 'Color',
                  undefined,
                  undefined,
                  this.game.obstacleMap
                );

                this.store.dispatch(new SetPlacingBot(true));
              }
            }
          });
      }
    });

    db.object('games/' + this.currentLobby!.settings.id + '/playerBots/')
      .valueChanges()
      .subscribe((changes: any) => {
        if (changes) {
          for (const [key, value] of Object.entries(changes)) {
            let v: any = value;
            let k: any = key;

            let player: Player | undefined = this.currentLobby!.player.get(
              v.uId
            );

            if (v.position[0] > 0 && v.position[1] > 0 && player) {
              console.log(this.placedBots.indexOf(player.uId));
              if (this.placedBots.indexOf(player.uId) == -1) {
                let bot: Bot = {
                  trackLength: 1,
                  trackColor: player.colorId + 1,
                  track: [],
                  name: player.name,
                  color: player.colorId,
                  crashed: false,
                  position: [v.position[0], v.position[1]],
                  direction: 'up',
                  brain: JSON.parse(v.botBrainData),
                };
                console.log(bot);
                simulationService.setBot(bot);
                this.placedBots.push(player.uId);
              }
            }
          }
          this.checkAllBotsPlaced();
        }
      });
  }

  checkAllBotsPlaced() {
    if (
      this.simulationService.simulation.bots.size >=
      this.currentLobby!.player.size
    ) {
      this.allBotsPlaced = true;
      this.currentLobby!.settings.simulationSteps =
        (this.currentLobby!.settings.simulationTime * 60 * 1000) /
        this.simulationService.simulation.statusVar.simulationSpeed;
      this.store.dispatch(new SetCurrentLobby(this.currentLobby));
      this.simulationService.start();
    }
  }

  ngOnInit(): void {
    this.store.dispatch(new SetEditing(false));

    this.firebaseUser$.subscribe((user: any) => {
      this.firebaseUser = user;
    });
  }
}
