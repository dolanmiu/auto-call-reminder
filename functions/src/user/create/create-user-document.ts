import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { UserData, USER_COLLECTION } from "../../global-shared";

export const createUserDocument = functions
  .region("europe-west2")
  .runWith({
    memory: "1GB",
  })
  .auth.user()
  .onCreate(async (user) => {
    const userData: UserData = {
      displayName: user.displayName ?? "Un-named",
    };

    console.log("Creating User Document", userData);

    await admin
      .firestore()
      .collection(USER_COLLECTION)
      .doc(user.uid)
      .create(userData);
  });
