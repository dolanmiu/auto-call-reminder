import * as functions from "firebase-functions";
// import * as admin from "firebase-admin";
// import { HttpsError } from "firebase-functions/lib/providers/https";
// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
import * as twilio from "twilio";

const accountSid = functions.config().TWILIO_ACCOUNT_SID;
const authToken = functions.config().TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const makeCall = async (toNumber: string): Promise<void> => {
  const { VoiceResponse } = twilio.twiml;

  const response = new VoiceResponse();
  response.play(
    {
      loop: 10,
    },
    "https://api.twilio.com/cowbell.mp3",
  );

  response.record({
    timeout: 10,
    transcribe: true,
  });

  console.log(response.toString());

  const main = async () => {
    try {
      const call = await client.calls.create({
        twiml: response.toString(),
        to: toNumber,
        from: "+447488880401",
        record: true,
        statusCallback: "`https://phone-scheduler.firebaseapp.com/make-call`",
        statusCallbackMethod: "POST",
      });
      console.log(call);

      // setInterval(async () => {
      //   //   console.log(client.calls..get(call.sid));
      //   console.log(await client.calls.list({ limit: 10 }));
      // }, 1000);
    } catch (e) {
      console.log(e);
    }
  };

  main();
};
