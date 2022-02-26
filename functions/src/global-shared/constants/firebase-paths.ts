export const USER_COLLECTION = "users";

export const getUserDocument = (userUid: string): string =>
  `${USER_COLLECTION}/${userUid}`;

export const getCallConfigCollection = (userUid: string): string =>
  `${getUserDocument(userUid)}/call-configs`;

export const getCallConfigDocument = (
  userUid: string,
  callConfigUid: string,
): string => `${getCallConfigCollection(userUid)}/${callConfigUid}`;

export const getCallsCollection = (
  userUid: string,
  callConfigUid: string,
): string => `${getCallConfigDocument(userUid, callConfigUid)}/calls`;
