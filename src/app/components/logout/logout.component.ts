import { Component, OnInit } from '@angular/core';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  faLogout = faSignOutAlt;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {}

  logOut() {
    this.firebaseService.logout();
  }
}
