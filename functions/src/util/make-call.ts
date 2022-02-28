import * as functions from "firebase-functions";
// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
import * as twilio from "twilio";

export const makeCall = async (toNumber: string): Promise<void> => {
  const accountSid = functions.config().TWILIO_ACCOUNT_SID;
  const authToken = functions.config().TWILIO_AUTH_TOKEN;
  console.log("Twilio credentials", accountSid, authToken);

  const client = twilio(accountSid, authToken);
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
        statusCallback:
          "https://europe-west2-phone-scheduler.cloudfunctions.net/writeCall",
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
