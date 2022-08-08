import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { HttpsError } from "firebase-functions/lib/providers/https";

import {
  getWhatsAppMessagesCollection,
  WhatsAppMessageRequest,
} from "../global-shared";
import { sendWhatsAppMessageToChat } from "../util";

export const sendWhatsAppMessage = functions
  .region("europe-west2")
  .runWith({ secrets: ["OPENAI_API_KEY"], memory: "4GB" })
  .https.onCall(
    async ({ userUid, chatId, message, configUid }: WhatsAppMessageRequest) => {
      if (!userUid) {
        throw new HttpsError(
          "unauthenticated",
          "Request had invalid credentials.",
          {
            "some-key": "some-value",
          },
        );
      }

      await sendWhatsAppMessageToChat(userUid, chatId, message);

      await admin
        .firestore()
        .collection(getWhatsAppMessagesCollection(userUid, configUid))
        .add({
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          status: "completed",
          content: message,
        });

      return;
    },
  );
