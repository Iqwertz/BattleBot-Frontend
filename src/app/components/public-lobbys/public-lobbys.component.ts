import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Select, State, Store } from '@ngxs/store';
import { AppState } from '../../store/app.state';
import {
  LobbyRef,
  FirebaseLobbyService,
} from '../../services/firebase-lobby.service';

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
    private fireBaseLobbyService: FirebaseLobbyService,
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router,
    private store: Store
  ) {
    let lobbyFirebaseRef = db.object('lobbys/').valueChanges();
    lobbyFirebaseRef.subscribe((changes: any) => {
      this.lobbys = this.filterPublic(this.changesToLobbyRefArray(changes));
      this.dataSource = new MatTableDataSource(this.lobbys);
      this.dataSource.sort = this.sort;
    });
  }

  displayedColumns: string[] = [
    'id',
    'players',
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
      if (!l.settings.private) {
        pubLobbys.push(l);
      }
    }

    return pubLobbys;
  }

  join(id: string) {
    if (!this.firebaseUser) {
      this.router.navigate(['createLobby', id]);
    } else {
      console.log('Error: already in game');
    }
  }

  getObjectLength(obj: any): number {
    if (obj) {
      return Object.keys(obj).length;
    } else {
      return -1;
    }
  }
}
