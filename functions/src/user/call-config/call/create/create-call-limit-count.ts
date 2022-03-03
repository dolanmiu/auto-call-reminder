import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { getCallDocument, getCallsCollection } from "../../../../global-shared";

const MAX_CALL_COUNT = 40;

export const createDeviceDocuments = functions
  .region("europe-west2")
  .runWith({
    memory: "1GB",
  })
  .firestore.document(
    getCallDocument("{userUid}", "{callConfigUid}", "{callUid}"),
  )
  .onCreate(async (_, context) => {
    const userUid = context.params.userUid as string;
    const callConfigUid = context.params.callConfigUid as string;

    const calls = (
      await admin
        .firestore()
        .collection(getCallsCollection(userUid, callConfigUid))
        .orderBy("createdAt", "asc")
        .get()
    ).docs;

    if (calls.length > MAX_CALL_COUNT) {
      const [firstCall] = calls;
      await admin
        .firestore()
        .doc(getCallDocument(userUid, callConfigUid, firstCall.id))
        .delete();
    }
  });
