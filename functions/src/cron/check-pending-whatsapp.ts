import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as Cron from "cron-converter";

import {
  cleanCron,
  getWhatsAppConfigCollection,
  getWhatsAppConfigDocument,
  getWhatsAppMessagesCollection,
  USER_COLLECTION,
  WhatsAppConfig,
  WhatsAppMessage,
} from "../global-shared";
import { predictWords, sendWhatsAppMessageToChat } from "../util";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const getCronString = require("@darkeyedevelopers/natural-cron.js");

export const checkPendingWhatsAppMessages = functions
  .runWith({ secrets: ["OPENAI_API_KEY"], memory: "4GB" })
  .pubsub.schedule("every 24 hours")
  .onRun(async () => {
    const users = await admin.firestore().collection(USER_COLLECTION).get();

    for (const user of users.docs) {
      const configs = await admin
        .firestore()
        .collection(getWhatsAppConfigCollection(user.id))
        .get();

      for (const configDoc of configs.docs) {
        const config = configDoc.data() as WhatsAppConfig;

        const messageDoc = await admin
          .firestore()
          .collection(getWhatsAppMessagesCollection(user.id, configDoc.id))
          .where("status", "in", ["completed", "dummy"])
          .orderBy("createdAt", "desc")
          .limit(1)
          .get();

        if (messageDoc.size > 0) {
          const message =
            messageDoc.docs[0].data() as WhatsAppMessage<FirebaseFirestore.Timestamp>;

          const cronInstance = new Cron({
            timezone: "Europe/London",
          });
          const cronString = cleanCron(getCronString(config.cron));
          console.log(`Cron for cron phrase '${config.cron}':`, cronString);

          try {
            cronInstance.fromString(cronString);
          } catch (e) {
            console.error(e);
            continue;
          }

          const currentDate = admin.firestore.Timestamp.now().toDate();
          const schedule = cronInstance.schedule(currentDate);
          const scheduledDate = schedule.prev().toDate();

          if (message.createdAt.toDate() < scheduledDate) {
            const finalMesage =
              config.gpt3Prompt !== ""
                ? (await predictWords(config.gpt3Prompt))[0]
                : config.message;

            if (config.enabled && (config.count > 0 || config.count === -1)) {
              const callOutput = await sendWhatsAppMessageToChat(
                user.id,
                config.to,
                finalMesage,
              );

              await admin
                .firestore()
                .collection(
                  getWhatsAppMessagesCollection(user.id, configDoc.id),
                )
                .add({
                  createdAt: admin.firestore.FieldValue.serverTimestamp(),
                  status: callOutput.status,
                  content: finalMesage,
                } as WhatsAppMessage<admin.firestore.FieldValue>);

              if (config.count > 0) {
                await admin
                  .firestore()
                  .doc(getWhatsAppConfigDocument(user.id, configDoc.id))
                  .update({
                    count: admin.firestore.FieldValue.increment(-1),
                  });
              }
            } else {
              await admin
                .firestore()
                .collection(
                  getWhatsAppMessagesCollection(user.id, configDoc.id),
                )
                .add({
                  createdAt: admin.firestore.FieldValue.serverTimestamp(),
                  status: "dummy",
                  content: "",
                });
            }
          } else {
            console.log("No messages for", config.cron);
          }
        } else {
          // Note: There is no messages and no dummy record
          // So it is not possible to know when to start calling
          // Do not risk calling
          return null;
        }
      }
    }

    return null;
  });
