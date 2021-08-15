import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface LobbyRef {
  editorTime: number;
  id: string;
  name: string;
  private: boolean;
  simulationTime: number;
  maxPlayer: number;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseLobbyService {

  constructor(private db: AngularFireDatabase) {
  }

  generateNewLobby() {
    let newLobby: LobbyRef = {
      editorTime: environment.defaultLobby.editorTime,
      id: '',
      maxPlayer: environment.defaultLobby.maxPlayer,
      name: '',
      private: environment.defaultLobby.private,
      simulationTime: environment.defaultLobby.simulationTime
    }

    this.db.list('/lobbys').push(newLobby);
  }
}
