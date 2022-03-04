import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as corsDefault from "cors";

import {
  CallConfig,
  getCallConfigDocument,
  getCallsCollection,
  getUserDocument,
  UserData,
} from "../global-shared";
import { makeCall } from "../util";

const cors = corsDefault({ origin: true });

export const testCall = functions
  .runWith({ secrets: ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN"] })
  .region("europe-west2")
  .https.onRequest(async (req, res) => {
    cors(req, res, async () => {
      const callConfigUid = req.query.callConfigUid as string | undefined;
      const userUid = req.query.userUid as string | undefined;

      if (!callConfigUid) {
        res.status(400).send("No Call Config UID found");
        return;
      }

      if (!userUid) {
        res.status(400).send("No User UID found");
        return;
      }

      const callConfigSnapshot = await admin
        .firestore()
        .doc(getCallConfigDocument(userUid, callConfigUid))
        .get();

      const userDataSnapshot = await admin
        .firestore()
        .doc(getUserDocument(userUid))
        .get();

      const callConfig = callConfigSnapshot.data() as CallConfig;
      const userData = userDataSnapshot.data() as UserData;

      console.log("Calling witg CallConfig:", callConfig);

      try {
        const call = await makeCall(
          callConfig.toNumber,
          process.env.TWILIO_ACCOUNT_SID ?? "",
          process.env.TWILIO_AUTH_TOKEN ?? "",
          callConfig.soundFile,
          userUid,
          callConfigUid,
          userData.phoneNumber,
        );

        await admin
          .firestore()
          .collection(getCallsCollection(userUid, callConfigUid))
          .doc(call.sid)
          .set({
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            status: call.status,
          });

        res.status(200).send();
      } catch (e) {
        console.log(e);
        res.status(500).send(e);
      }
    });
  });
