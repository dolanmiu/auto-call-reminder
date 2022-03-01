import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as Cron from "cron-converter";

import {
  Call,
  CallConfig,
  getCallConfigCollection,
  getCallsCollection,
  USER_COLLECTION,
} from "../global-shared";
import { makeCall } from "../util";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const getCronString = require("@darkeyedevelopers/natural-cron.js");

export const checkPendingCalls = functions
  .runWith({ secrets: ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN"] })
  .pubsub.schedule("every 5 minutes")
  .onRun(async () => {
    const users = await admin.firestore().collection(USER_COLLECTION).get();

    for (const user of users.docs) {
      const callConfigs = await admin
        .firestore()
        .collection(getCallConfigCollection(user.id))
        .get();

      for (const callConfigDoc of callConfigs.docs) {
        const callConfig = callConfigDoc.data() as CallConfig;
        const cronInstance = new Cron();
        cronInstance.fromString(getCronString(callConfig.cron));
        const schedule = cronInstance.schedule();
        const date = schedule.prev().toDate();

        const callDoc = await admin
          .firestore()
          .collection(getCallsCollection(user.id, callConfigDoc.id))
          .where("status", "==", "completed")
          .orderBy("createdAt", "desc")
          .limit(1)
          .get();

        if (callDoc.size > 0) {
          const call =
            callDoc.docs[0].data() as Call<FirebaseFirestore.Timestamp>;
          if (call.createdAt.toDate() < date) {
            await makeCall(
              callConfig.toNumber,
              process.env.TWILIO_ACCOUNT_SID ?? "",
              process.env.TWILIO_AUTH_TOKEN ?? "",
            );
          }
        } else {
          await makeCall(
            callConfig.toNumber,
            process.env.TWILIO_ACCOUNT_SID ?? "",
            process.env.TWILIO_AUTH_TOKEN ?? "",
          );
        }
      }
    }

    return null;
  });
