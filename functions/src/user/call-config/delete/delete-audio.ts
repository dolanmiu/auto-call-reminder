import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { getCallConfigDocument } from "../../../global-shared";

export const deleteAudio = functions
  .region("europe-west2")
  .firestore.document(getCallConfigDocument("{userUid}", "{callConfigUid}"))
  .onDelete(async (_, context) => {
    const userUid = context.params.userUid as string;
    const callConfigUid = context.params.callConfigUid as string;

    await admin
      .storage()
      .bucket()
      .deleteFiles({
        prefix: `${getCallConfigDocument(userUid, callConfigUid)}.wav`,
      });
  });
