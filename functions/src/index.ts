import * as admin from "firebase-admin";

admin.initializeApp({
  storageBucket: "gs://phone-scheduler.appspot.comm",
});

export * from "./user";
export * from "./cron";
export * from "./endpoint";
