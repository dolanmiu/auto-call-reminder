// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
import * as twilio from "twilio";
import { CallInstance } from "twilio/lib/rest/api/v2010/account/call";

export const makeCall = async (
  toNumber: string,
  accountSid: string,
  authToken: string,
  soundFile: string,
  userUid: string,
  callConfigUid: string,
): Promise<CallInstance> => {
  const client = twilio(accountSid, authToken);
  const { VoiceResponse } = twilio.twiml;

  const response = new VoiceResponse();
  response.play(
    soundFile === "" ? "http://demo.twilio.com/docs/classic.mp3" : soundFile,
  );

  response.record({
    timeout: 10,
    transcribe: true,
  });

  console.log(response.toString());

  const call = await client.calls.create({
    twiml: response.toString(),
    to: toNumber,
    from: "+447488880401",
    record: true,
    timeout: 20,
    statusCallback: `https://us-east4-phone-scheduler.cloudfunctions.net/writeCall?userUid=${userUid}&callConfigUid=${callConfigUid}`,
    statusCallbackEvent: ["ringing", "answered", "completed"],
    statusCallbackMethod: "POST",
  });
  console.log(call.sid);

  return call;
};
