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

export const checkPendingCalls = functions.pubsub
  .schedule("every 5 minutes")
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
        cronInstance.fromString(callConfig.cron);
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
          const call = callDoc.docs[0].data() as Call;
          if (call.createdAt.toDate() < date) {
            await makeCall(callConfig.toNumber);
          }
        } else {
          await makeCall(callConfig.toNumber);
        }
      }
    }

    return null;
  });
