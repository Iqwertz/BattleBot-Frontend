import { ConsoleService } from './../../services/console.service';
import { Component, OnInit } from '@angular/core';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { BrainData } from '../../services/bot-compiler.service';
import { PrecompilerService } from '../../services/precompiler.service';
import { TerminalsService } from '../../services/terminals.service';
import { Bot } from '../battle-map/battle-map.component';
import { environment } from '../../../environments/environment';
import { Store } from '@ngxs/store';
import { SetCompiledBot } from '../../store/app.action';


@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss'],
})
export class ConsoleComponent implements OnInit {
  constructor(
    private preCompiler: PrecompilerService,
    private terminalService: TerminalsService,
    private store: Store,
    public consoleService: ConsoleService
  ) { }

  ngOnInit(): void {

  }

  faPlay = faPlay;

  compile() {
    let brain: BrainData = this.preCompiler.terminalMapToBrainData(
      this.terminalService.terminals
    );
    let bot: Bot = {
      color: 3,
      crashed: false,
      direction: 'up',
      name: 'Testing Bot',
      position: [0, 0],
      track: [],
      trackColor: 4,
      trackLength: environment.defaultTrackLength,
      brain: brain,
    };

    this.store.dispatch(new SetCompiledBot(bot));
  }
}
