// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // configuracion de Firebase
  firebaseConfig: {
    apiKey: 'AIzaSyABUX8UDGRAWygMiua-mJZL_qK-odceqrA',
    authDomain: 'appttdb.firebaseapp.com',
    databaseURL: 'https://appttdb.firebaseio.com',
    projectId: 'appttdb',
    storageBucket: 'appttdb.appspot.com',
    messagingSenderId: '221915991759',
    appId: '1:221915991759:web:3cbd3fa8905736067bb1ba',
    measurementId: 'G-HTXW049L7C'
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
