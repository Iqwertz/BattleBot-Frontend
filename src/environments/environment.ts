// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  alertTime: 3,
  simulationSpeed: 100,
  defaultMapSize: [40, 40],
  defaultTrackLength: 1,
  maxPlayer: 10,
  maxTime: 80,
  maxMapSize: 150,
  speedRange: [100, 1500],
  obstacleNoiseSettings: {
    threshold: 0.7,
    octaveCount: 4,
    amplitude: 0.2,
    persistence: 0.1,
  },
  obstacleMaxNoiseSettings: {
    threshold: 1,
    octaveCount: 10,
    amplitude: 1,
    persistence: 1,
  },
  defaultLobby: {
    editorTime: 5,
    private: false,
    simulationTime: 2,
    maxPlayer: 4,
  },
  availableBotColors: 14,
  botByteRange: [5, 32],
  roboNames: [
    'AVA',
    'B-4',
    'D.A.V.E.',
    'Dewey',
    'Encoid',
    'Flexo',
    'Hermes',
    'Huey',
    'Orbotron',
    'Proto',
    'Qwerty',
    'Scrappy',
    'Socket',
    'Sparky',
    'Ubaroid',
    'Ultron',
  ],
  byteColorMap: {
    //spielerspur farbe muss immer um eines höher sein als spieler
    0: '#fff', //weiß
    1: '#000000', //schwarz //obstacle
    2: '#000000', //unused
    3: '#3bff00', //spieler 1 (reserved vor Bot in editor)
    4: '#a5ff8a', //spieler 1 spur
    5: '#E74C3C', //spieler 2
    6: '#F1948A', //spieler 2 spur
    7: '#9B59B6', //spieler 3
    8: '#C39BD3', //spieler 3 spur
    9: '#8E44AD', //spieler 4
    10: '#BB8FCE', //spieler 4 spur
    11: '#2980B9', //spieler 5
    12: '#7FB3D5', //spieler 5 spur
    13: '#3498DB', //spieler 6
    14: '#85C1E9', //spieler 6 spur
    15: '#1ABC9C', //spieler 7
    16: '#76D7C4', //spieler 7 spur
    17: '#16A085', //spieler 8
    18: '#73C6B6', //spieler 8 spur
    19: '#27AE60', //spieler 9
    20: '#7DCEA0', //spieler 9 spur
    21: '#2ECC71', //spieler 10
    22: '#82E0AA', //spieler 10 spur
    23: '#F1C40F', //spieler 11
    24: '#F7DC6F', //spieler 11 spur
    25: '#F39C12', //spieler 12
    26: '#F8C471', //spieler 12 spur
    27: '#E67E22', //spieler 13
    28: '#F0B27A', //spieler 13 spur
    29: '#D35400', //spieler 14
    30: '#E59866', //spieler 14 spur
    31: '#C0392B', //spieler 15
    32: '#D98880', //spieler 15 spur
    33: '#fff12c', //spieler 16
    34: '#fff67f', //spieler 16 spur
  },
  firebase: {
    apiKey: 'AIzaSyDXNRV9_r3zknpr248CjjpYlOjIMyHp_p0',
    authDomain: 'battlebots-30657.firebaseapp.com',
    databaseURL:
      'https://battlebots-30657-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'battlebots-30657',
    storageBucket: 'battlebots-30657.appspot.com',
    messagingSenderId: '1055434284018',
    appId: '1:1055434284018:web:f2c77a90810a177c8c296b',
    measurementId: 'G-LMHVYRXG07',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
