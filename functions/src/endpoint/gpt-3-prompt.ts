import * as functions from "firebase-functions";
import { HttpsError } from "firebase-functions/lib/providers/https";

import { Gpt3PromptRequest } from "../global-shared";
import { predictWords } from "../util";

export const gpt3Prompt = functions
  .region("europe-west2")
  .runWith({ secrets: ["OPENAI_API_KEY"] })
  .https.onCall(async ({ prompt }: Gpt3PromptRequest, context) => {
    const userUid = context.auth?.uid;

    if (!userUid) {
      throw new HttpsError(
        "unauthenticated",
        "Request had invalid credentials.",
        {
          "some-key": "some-value",
        },
      );
    }

    return await predictWords(prompt);
  });
