import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// import { Timestamp } from "firebase/firestore";

import { Call, getCallsCollection } from "../global-shared";
import { CallInstance } from "twilio/lib/rest/api/v2010/account/call";

export const writeCall = functions
  .region("europe-west2")
  .https.onRequest(async (req, res) => {
    const callInstance = req.body.callInstance as CallInstance | undefined;
    const userUid = req.body.userUid as string | undefined;
    const callConfigUid = req.body.callConfigUid as string | undefined;

    if (!callInstance) {
      res.status(400).send("No Call Instance found");
      return;
    }

    if (!userUid) {
      res.status(400).send("No User UID found");
      return;
    }

    if (!callConfigUid) {
      res.status(400).send("No callConfigUid found");
      return;
    }

    const call: Call<FirebaseFirestore.Timestamp> = {
      createdAt: admin.firestore.Timestamp.now(),
      status: callInstance.status,
    };

    await admin
      .firestore()
      .collection(getCallsCollection(userUid, callConfigUid))
      .doc()
      .create(call);
  });
