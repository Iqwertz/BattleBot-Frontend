import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-private-lobby-code',
  templateUrl: './private-lobby-code.component.html',
  styleUrls: ['./private-lobby-code.component.scss'],
})
export class PrivateLobbyCodeComponent implements OnInit {
  constructor() {}

  inputCode: string = '';
  ngOnInit(): void {}
}
