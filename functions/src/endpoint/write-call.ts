import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// import { Timestamp } from "firebase/firestore";
import * as corsDefault from "cors";

import { Call, getCallsCollection } from "../global-shared";
import { TwilioStatusCallback } from "../global-shared/models/twilio-status-callback";

const cors = corsDefault({ origin: true });

export const writeCall = functions
  .region("us-east4")
  .runWith({
    memory: "1GB",
  })
  .https.onRequest(async (req, res) => {
    cors(req, res, async () => {
      console.log("Start writing call");
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
        recordingUrl: statusCallback.RecordingUrl ?? "",
      };

      console.log("Created call Payload", call);

      await admin
        .firestore()
        .collection(getCallsCollection(userUid, callConfigUid))
        .doc(statusCallback.CallSid)
        .update(call);

      console.log("Finished writing to store", call);

      res.status(200).end();
    });
  });
