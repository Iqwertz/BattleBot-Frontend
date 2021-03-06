import { User } from '../services/firebase/firebase.service';
import { LobbyRef } from '../services/firebase/firebase-lobby.service';
import { Bot } from '../modules/game/components/battle-map/battle-map.component';
export class SetCompiledBot {
  static type = 'SetCompiledBot';
  constructor(public compiledBot: Bot | undefined) {}
}

export class SetPlacingBot {
  static type = 'SetPlacingBot';
  constructor(public placingBot: boolean) {}
}
export class SetFirebaseUser {
  static type = 'SetFirebaseUser';
  constructor(public firebaseUser: any) {}
}
export class SetCurrentLobby {
  static type = 'SetCurrentLobby';
  constructor(public currentLobby: LobbyRef | undefined) {}
}
export class SetEditing {
  static type = 'SetEditing';
  constructor(public editing: boolean) {}
}
