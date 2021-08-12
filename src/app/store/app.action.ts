import { Bot } from '../components/battle-map/battle-map.component';
export class SetCompiledBot {
  static type = 'SetCompiledBot';
  constructor(public compiledBot: Bot) { }
}

export class SetPlacingBot {
  static type = 'SetPlacingBot';
  constructor(public placingBot: boolean) { }
}
