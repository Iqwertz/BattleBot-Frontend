// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { StringMap } from "@angular/compiler/src/compiler_facade_interface";

export const environment = {
  production: false,
  simulationSpeed: 1,
  obstacleNoiseSettings: {
    octaveCount: 5,
    amplitude: 0.2,
    persistence: 0.1,
  },
  byteColorMap: {  //spielerspur farbe muss immer um eines höher sein als spieler
    0: '#fff',    //weiß
    1: '#000000', //schwarz
    2: '#000000', //unused
    3: '#3d47ff', //spieler 1
    4: '#7a81ff', //spieler 1 spur
    5: '#2eff39', //spieler 2
    6: '#7aff81',  //spieler 2 spur
    7: '#ff2e2e', //spieler 3
    8: '#ff6969', //spieler 3 spur
    9: '#fff021', //spieler 4
    10: '#fff569'  //spieler 4 spur
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
