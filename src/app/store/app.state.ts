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
import { SetCompiledBot } from './app.action';

export interface AppStateModel {
  compiledBot: Bot | undefined;
}

@State<AppStateModel>({
  name: 'appState',
  defaults: {
    compiledBot: undefined,
  },
})
export class AppState {
  @Selector()
  static compiledBot(state: AppStateModel) {
    return state.compiledBot;
  }

  @Action(SetCompiledBot)
  setUserId(context: StateContext<AppStateModel>, action: SetCompiledBot) {
    context.patchState({
      compiledBot: action.compiledBot,
    });
  }
}
