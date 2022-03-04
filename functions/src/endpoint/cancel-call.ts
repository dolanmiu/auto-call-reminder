import * as functions from "firebase-functions";
import * as corsDefault from "cors";

import { setCallStatusToComplete } from "../util";

const cors = corsDefault({ origin: true });

export const cancelCall = functions
  .runWith({ secrets: ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN"] })
  .region("europe-west2")
  .https.onRequest(async (req, res) => {
    cors(req, res, async () => {
      console.log(
        "details",
        process.env.TWILIO_ACCOUNT_SID ?? "",
        process.env.TWILIO_AUTH_TOKEN ?? "",
      );
      const callUid = req.query.callUid as string | undefined;

      if (!callUid) {
        res.status(400).send("No Call UID found");
        return;
      }

      console.log("Attempting to stop call", callUid);

      try {
        const call = await setCallStatusToComplete(
          callUid,
          process.env.TWILIO_ACCOUNT_SID ?? "",
          process.env.TWILIO_AUTH_TOKEN ?? "",
        );
        console.log("Stopped call", call.sid);

        res.status(200).end();
      } catch (e) {
        console.error(e);
        res.status(500).end(e);
      }
    });
  });
