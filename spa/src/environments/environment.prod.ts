import { Environment } from './environment-type';
import { FIREBASE_SDK_CONFIG } from './firebase.conf';

export const environment: Environment = {
  production: true,
  firebase: FIREBASE_SDK_CONFIG,
  brandName: 'Phone Scheduler',
};
