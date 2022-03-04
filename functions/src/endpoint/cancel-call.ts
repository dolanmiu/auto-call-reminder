import * as functions from "firebase-functions";
import * as corsDefault from "cors";

import { setCallStatusToComplete } from "../util";

const cors = corsDefault({ origin: true });

export const cancelCall = functions
  .region("us-east4")
  .runWith({
    memory: "1GB",
    secrets: ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN"],
  })
  .https.onRequest(async (req, res) => {
    cors(req, res, async () => {
      const callUid = req.query.callUid as string | undefined;

      if (!callUid) {
        res.status(400).send("No Call UID found");
        return;
      }

      const call = await setCallStatusToComplete(
        callUid,
        process.env.TWILIO_ACCOUNT_SID ?? "",
        process.env.TWILIO_AUTH_TOKEN ?? "",
      );

      console.log("Stopped call", call);

      res.status(200).end();
    });
  });
