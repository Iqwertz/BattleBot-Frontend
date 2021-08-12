import { Bot } from '../components/battle-map/battle-map.component';
export class SetCompiledBot {
  static type = 'SetCompiledBot';
  constructor(public compiledBot: Bot) {}
}
