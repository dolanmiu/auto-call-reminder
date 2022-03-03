import * as admin from "firebase-admin";

admin.initializeApp({
  storageBucket: "gs://phone-scheduler.appspot.com",
});

export * from "./user";
export * from "./cron";
export * from "./endpoint";
