// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { initializeApp } from "@angular/fire/app";

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyCV4mauu27VeRU4W-bxRLU9s46qEyznlBQ",
    authDomain: "ionicbourbaki.firebaseapp.com",
    projectId: "ionicbourbaki",
    storageBucket: "ionicbourbaki.firebasestorage.app",
    messagingSenderId: "190785625594",
    appId: "1:190785625594:web:59e970902096bef1311843",
    measurementId: "G-YXBY9BQMZK"
  }
};

const app = initializeApp(environment.firebase);

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
