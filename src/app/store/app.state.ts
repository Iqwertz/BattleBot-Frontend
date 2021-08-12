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
import { SetCompiledBot, SetPlacingBot } from './app.action';

export interface AppStateModel {
  compiledBot: Bot | undefined;
  placingBot: boolean;
}

@State<AppStateModel>({
  name: 'appState',
  defaults: {
    compiledBot: undefined,
    placingBot: false,
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
}
