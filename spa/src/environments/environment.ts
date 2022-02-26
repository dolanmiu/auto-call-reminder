import { Environment } from './environment-type';
import { FIREBASE_SDK_CONFIG } from './firebase.conf';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: Environment = {
  production: false,
  firebase: {
    projectId: 'phone-scheduler',
    appId: '1:705171398397:web:abe32957269b45c0862894',
    storageBucket: 'phone-scheduler.appspot.com',
    locationId: 'europe-west',
    apiKey: 'AIzaSyCMslVeC62ecvtzsC-LLXEngfAv7SKYp4k',
    authDomain: 'phone-scheduler.firebaseapp.com',
    messagingSenderId: '705171398397',
    measurementId: 'G-SYNJCZTPWN',
  },
  brandName: 'Phone Scheduler',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
