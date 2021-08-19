import { LobbyRef } from './../services/firebase-lobby.service';
//////Use
/*
  @Select(AppState.userId)
  userId$;
  ngOninit:
    this.userId$.subscribe((userId: string) => {
      this.userId = userId;
    });
  Set:
  constructor: private store: Store
  this.store.dispatch(new SetUserId(x));
*/

import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Bot } from '../components/battle-map/battle-map.component';
import { SetEditing } from './app.action';
import {
  SetCompiledBot,
  SetPlacingBot,
  SetFirebaseUser,
  SetCurrentLobby,
} from './app.action';

export interface AppStateModel {
  compiledBot: Bot | undefined;
  placingBot: boolean;
  firebaseUser: any; //cant find the angularfire ts definition :(
  currentLobby: LobbyRef | undefined;
  editing: boolean;
}

@State<AppStateModel>({
  name: 'appState',
  defaults: {
    compiledBot: undefined,
    placingBot: false,
    firebaseUser: undefined,
    currentLobby: undefined,
    editing: false,
  },
})
export class AppState {
  @Selector()
  static compiledBot(state: AppStateModel) {
    return state.compiledBot;
  }

  @Action(SetCompiledBot)
  setCompiledBot(context: StateContext<AppStateModel>, action: SetCompiledBot) {
    context.patchState({
      compiledBot: action.compiledBot,
    });
  }

  @Selector()
  static placingBot(state: AppStateModel) {
    return state.placingBot;
  }

  @Action(SetPlacingBot)
  setPlacingBot(context: StateContext<AppStateModel>, action: SetPlacingBot) {
    context.patchState({
      placingBot: action.placingBot,
    });
  }

  @Selector()
  static firebaseUser(state: AppStateModel) {
    return state.firebaseUser;
  }

  @Action(SetFirebaseUser)
  setFirebaseUser(
    context: StateContext<AppStateModel>,
    action: SetFirebaseUser
  ) {
    context.patchState({
      firebaseUser: action.firebaseUser,
    });
  }

  @Selector()
  static currentLobby(state: AppStateModel) {
    return state.currentLobby;
  }

  @Action(SetCurrentLobby)
  setCurrentLobby(
    context: StateContext<AppStateModel>,
    action: SetCurrentLobby
  ) {
    context.patchState({
      currentLobby: action.currentLobby,
    });
  }

  @Selector()
  static editing(state: AppStateModel) {
    return state.editing;
  }

  @Action(SetEditing)
  setEditing(context: StateContext<AppStateModel>, action: SetEditing) {
    context.patchState({
      editing: action.editing,
    });
  }
}
