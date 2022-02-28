import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as corsDefault from "cors";

import { CallConfig, getCallConfigDocument } from "../global-shared";
import { makeCall } from "../util";

const cors = corsDefault({ origin: true });

export const testCall = functions
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

      const callConfig = callConfigSnapshot.data() as CallConfig;

      await makeCall(callConfig.toNumber);
    });
  });
