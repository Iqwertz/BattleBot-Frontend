import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { Command } from '../editor-ide/editor-ide.component';
import { BotCompilerService } from '../../services/bot-compiler.service';

@Component({
  selector: 'app-dragdrop-preview',
  templateUrl: './dragdrop-preview.component.html',
  styleUrls: ['./dragdrop-preview.component.scss'],
})
export class DragdropPreviewComponent implements OnInit, AfterViewInit {
  constructor(private botCompiler: BotCompilerService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  @Input() previewCommands: Command[] = [];

  isLogic(instruction: any) {
    return this.botCompiler.checkIfLogicInstruction(instruction.type);
  }
}
