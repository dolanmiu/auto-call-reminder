// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
import * as twilio from "twilio";
import { CallInstance } from "twilio/lib/rest/api/v2010/account/call";

export const setCallStatusToComplete = async (
  callSid: string,
  accountSid: string,
  authToken: string,
): Promise<CallInstance> => {
  const client = twilio(accountSid, authToken);

  const call = await client.calls(callSid).update({ status: "completed" });

  return call;
};
