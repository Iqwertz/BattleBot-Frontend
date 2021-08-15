import { FirebaseLobbyService } from './../../services/firebase-lobby.service';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lobby-select',
  templateUrl: './lobby-select.component.html',
  styleUrls: ['./lobby-select.component.scss']
})
export class LobbySelectComponent implements OnInit {
  item: Observable<any>;
  constructor(db: AngularFireDatabase, private firebaseLobbyService: FirebaseLobbyService) {
    this.item = db.object('lobbys').valueChanges();
    this.item.subscribe((changes) => {
      console.log(changes)
    })
  }

  ngOnInit(): void {
  }

  createNewLobby() {
    this.firebaseLobbyService.generateNewLobby();
  }

}
