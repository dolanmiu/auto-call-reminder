import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import {
  getCallConfigDocument,
  getCallsCollection,
} from "../../../global-shared";

export const deleteCalls = functions
  .region("europe-west2")
  .firestore.document(getCallConfigDocument("{userUid}", "{callConfigUid}"))
  .onDelete(async (_, context) => {
    const userUid = context.params.userUid as string;
    const callConfigUid = context.params.callConfigUid as string;

    const callsCollection = await admin
      .firestore()
      .collection(getCallsCollection(userUid, callConfigUid))
      .get();

    const batch = admin.firestore().batch();

    callsCollection.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  });
