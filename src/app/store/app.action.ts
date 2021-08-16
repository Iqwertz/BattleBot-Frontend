import { Bot } from '../components/battle-map/battle-map.component';
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
