import { FirebaseService } from 'src/app/services/firebase.service';
import { Component, OnInit } from '@angular/core';
import { faInfo, faTerminal } from '@fortawesome/free-solid-svg-icons';
import { AppState } from '../../store/app.state';
import { LobbyRef, GameBotEntry } from '../../services/firebase-lobby.service';
import { Select, Store } from '@ngxs/store';
import { PrecompilerService } from '../../services/precompiler.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { SimulationService } from '../../services/simulation.service';
import { SetEditing } from '../../store/app.action';

@Component({
  selector: 'app-bot-editor',
  templateUrl: './bot-editor.component.html',
  styleUrls: ['./bot-editor.component.scss'],
})
export class BotEditorComponent implements OnInit {
  faInfo = faInfo;
  faTerminal = faTerminal;

  @Select(AppState.currentLobby) currentLobby$: any;
  currentLobby: LobbyRef | undefined;

  @Select(AppState.firebaseUser) firebaseUser$: any;
  firebaseUser: any;

  timeLeft: string = '--:--';

  calcInterval;

  constructor(
    private preCompilerService: PrecompilerService,
    private db: AngularFireDatabase,
    private router: Router,
    private store: Store,
    private firebaseService: FirebaseService
  ) {
    this.calcInterval = setInterval(() => {
      this.calcTimeLeft();
    }, 500);
  }

  ngOnInit(): void {
    this.currentLobby$.subscribe((newLobby: LobbyRef | undefined) => {
      this.currentLobby = newLobby;
    });
    this.firebaseUser$.subscribe((user: any) => {
      this.firebaseUser = user;
    });
    this.store.dispatch(new SetEditing(true));
  }

  calcTimeLeft() {
    if (this.currentLobby) {
      let diff: number =
        new Date(this.currentLobby.settings.editorEndTimeStamp).getTime() -
        new Date().getTime();

      let minutes = Math.floor((diff % 3.6e5) / 6e4);
      let seconds = Math.floor((diff % 6e4) / 1000);

      this.timeLeft = minutes + ':' + seconds;

      if (diff < 0) {
        clearInterval(this.calcInterval);
        this.submitBot();
      }
    }
  }

  submitBot() {
    console.log('submitting bot');
    let brain: string = this.preCompilerService.lastSuccesfullCompile;

    if (this.currentLobby) {
      let gameBotEntry: GameBotEntry = {
        position: [0, 0],
        botBrainData: brain,
        uId: this.firebaseUser.uid,
      };

      this.firebaseService.submitBot(gameBotEntry).then(() => {
        if (this.firebaseUser.uid == this.currentLobby!.adminUid) {
          this.firebaseService.setGame();
          this.firebaseService.updateGameState('play');
        }
      });
    }
  }
}
