import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// import { Timestamp } from "firebase/firestore";

import { Call, getCallsCollection } from "../global-shared";
import { TwilioStatusCallback } from "../global-shared/models/twilio-status-callback";

export const writeCall = functions
  .region("europe-west2")
  .https.onRequest(async (req, res) => {
    const statusCallback = req.body as TwilioStatusCallback | undefined;
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

    if (!statusCallback) {
      res.status(400).send("No Status Callback");
      return;
    }

    const call: Partial<Call<FirebaseFirestore.Timestamp>> = {
      status: statusCallback.CallStatus,
      recordingUrl: statusCallback.RecordingUrl,
    };

    await admin
      .firestore()
      .collection(getCallsCollection(userUid, callConfigUid))
      .doc(statusCallback.CallSid)
      .update(call);
  });
