import { Environment } from './environment-type';
import { FIREBASE_SDK_CONFIG } from './firebase.conf';

export const environment: Environment = {
  production: true,
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
