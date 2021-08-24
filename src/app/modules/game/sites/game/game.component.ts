import { FirebaseService } from '../../../../services/firebase.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  constructor(public firebaseService: FirebaseService) {}

  ngOnInit(): void {}
}
