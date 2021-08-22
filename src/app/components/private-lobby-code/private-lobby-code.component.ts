import { FirebaseLobbyService } from './../../services/firebase-lobby.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-private-lobby-code',
  templateUrl: './private-lobby-code.component.html',
  styleUrls: ['./private-lobby-code.component.scss'],
})
export class PrivateLobbyCodeComponent implements OnInit {
  constructor(private firebaseService: FirebaseService, private firebaseLobbyService: FirebaseLobbyService) { }

  inputCode: string = '';
  ngOnInit(): void { }

  onInput(e: any) {
    this.inputCode = e.toUpperCase()
    if (this.inputCode.length == 5) {
      this.firebaseService.getLobby(this.inputCode).then((snap) => {
        if (snap.exists()) {
          this.firebaseLobbyService.joinLobby(this.inputCode);
          this.inputCode = ''
        } else {
          this.inputCode = '';
          console.log("error: this lobby doesnt exist")
        }
      })
    }
  }
}
