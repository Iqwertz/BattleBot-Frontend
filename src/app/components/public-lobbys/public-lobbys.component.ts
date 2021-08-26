import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { AppState } from '../../store/app.state';
import { AlertService } from '../../services/alert.service';
import {
  LobbyRef,
  FirebaseLobbyService,
} from '../../services/firebase/firebase-lobby.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-public-lobbys',
  templateUrl: './public-lobbys.component.html',
  styleUrls: ['./public-lobbys.component.scss'],
})
export class PublicLobbysComponent implements OnInit {
  lobbys: LobbyRef[] = [];

  @Select(AppState.firebaseUser) firebaseUser$: any;
  firebaseUser: any;

  constructor(
    private db: AngularFireDatabase,
    private fireBaseLobbyService: FirebaseLobbyService
  ) {
    let lobbyFirebaseRef = db.object('lobbys/').valueChanges();
    lobbyFirebaseRef.subscribe((changes: any) => {
      this.lobbys = this.filterMaxPlayer(
        this.filterPublic(this.changesToLobbyRefArray(changes))
      );
      this.dataSource = new MatTableDataSource(this.lobbys);
      this.dataSource.sort = this.sort;
    });
  }

  displayedColumns: string[] = [
    'name',
    'id',
    'players',
    'size',
    'mode',
    'editorTime',
    'simulationTime',
  ];
  dataSource = new MatTableDataSource(this.lobbys);

  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  ngOnInit(): void {
    this.firebaseUser$.subscribe((user: any) => {
      this.firebaseUser = user;
    });
  }

  private changesToLobbyRefArray(changes: any): LobbyRef[] {
    let arr: LobbyRef[] = [];
    for (let key in changes) {
      arr.push(changes[key]);
    }
    return arr;
  }

  private filterPublic(lobbys: LobbyRef[]): LobbyRef[] {
    let pubLobbys: LobbyRef[] = [];

    for (let l of lobbys) {
      if (!l.settings.private && !l.settings.gameStarted) {
        pubLobbys.push(l);
      }
    }

    return pubLobbys;
  }

  private filterMaxPlayer(lobbys: LobbyRef[]): LobbyRef[] {
    let pubLobbys: LobbyRef[] = [];

    for (let l of lobbys) {
      if (l.player) {
        if (l.settings.maxPlayer > this.getObjectLength(l.player)) {
          pubLobbys.push(l);
        }
      }
    }

    return pubLobbys;
  }

  join(id: string) {
    this.fireBaseLobbyService.joinLobby(id);
  }

  getObjectLength(obj: any): number {
    if (obj) {
      return Object.keys(obj).length;
    } else {
      return -1;
    }
  }
}
