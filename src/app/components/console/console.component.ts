import { ConsoleService } from './../../services/console.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { BrainData } from '../../services/bot-compiler.service';
import { PrecompilerService } from '../../services/precompiler.service';
import { TerminalsService } from '../../services/terminals.service';
import { Bot } from '../battle-map/battle-map.component';
import { environment } from '../../../environments/environment';
import { Store, Select } from '@ngxs/store';
import { SetCompiledBot } from '../../store/app.action';
import { AppState } from '../../store/app.state';

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
  ) {}

  @Select(AppState.compiledBot) compiledBot$: any;
  compiledBot: Bot | undefined = undefined;

  ngOnInit(): void {
    this.compiledBot$.subscribe((bot: Bot | undefined) => {
      this.compiledBot = bot;
    });

    this.consoleService.scrollToBottom$.subscribe(() => {
      this.scrollToBottom();
    });
  }

  faPlay = faPlay;

  @ViewChild('scrollRef') private scrollContainer!: ElementRef;

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  compile() {
    let brain: BrainData | undefined = this.preCompiler.terminalMapToBrainData(
      this.terminalService.terminals
    );

    if (brain) {
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
    } else {
      this.store.dispatch(new SetCompiledBot(undefined));
    }
  }
}
