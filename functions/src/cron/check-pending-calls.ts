import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as Cron from "cron-converter";

import {
  Call,
  CallConfig,
  cleanCron,
  getCallConfigCollection,
  getCallsCollection,
  getUserDocument,
  UserData,
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

        const callDoc = await admin
          .firestore()
          .collection(getCallsCollection(user.id, callConfigDoc.id))
          .where("status", "in", ["completed", "dummy"])
          .orderBy("createdAt", "desc")
          .limit(1)
          .get();

        const userDataSnapshot = await admin
          .firestore()
          .doc(getUserDocument(user.id))
          .get();

        const userData = userDataSnapshot.data() as UserData;

        if (callDoc.size > 0) {
          const call =
            callDoc.docs[0].data() as Call<FirebaseFirestore.Timestamp>;

          const cronInstance = new Cron({
            timezone: "Europe/London",
          });
          const cronString = cleanCron(getCronString(callConfig.cron));
          console.log(`Cron for cron phrase '${callConfig.cron}':`, cronString);
          cronInstance.fromString(cronString);
          const currentDate = admin.firestore.Timestamp.now().toDate();
          const schedule = cronInstance.schedule(currentDate);
          const scheduledDate = schedule.prev().toDate();

          if (call.createdAt.toDate() < scheduledDate) {
            const call = await makeCall(
              callConfig.toNumber,
              process.env.TWILIO_ACCOUNT_SID ?? "",
              process.env.TWILIO_AUTH_TOKEN ?? "",
              callConfig.soundFile,
              user.id,
              callConfigDoc.id,
              userData.phoneNumber,
            );

            await admin
              .firestore()
              .collection(getCallsCollection(user.id, callConfigDoc.id))
              .doc(call.sid)
              .set({
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                status: call.status,
              });
          }
        } else {
          // Note: There is no calls and no dummy record
          // So it is not possible to know when to start calling
          // Do not risk calling
          return null;
        }
      }
    }

    return null;
  });
