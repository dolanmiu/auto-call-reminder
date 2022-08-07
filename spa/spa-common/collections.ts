import { CollectionReference, Firestore, doc } from '@angular/fire/firestore';

import { CallConfig, Call, WhatsAppConfig, WhatsAppMessage } from '@models';
import {
  getCallConfigCollection,
  getCallsCollection,
  getWhatsAppConfigCollection,
  getWhatsAppMessagesCollection,
} from '@constants';
import { oneToOneConverter } from '@common';
import { collection } from 'firebase/firestore';

export const getCallConfigCollectionReference = (
  firestore: Firestore,
  userUid: string
): CollectionReference<CallConfig> =>
  collection(firestore, getCallConfigCollection(userUid)).withConverter(
    oneToOneConverter<CallConfig>()
  );

export const getCallCollectionReference = <T>(
  firestore: Firestore,
  userUid: string,
  callConfigUid: string
): CollectionReference<Call<T>> =>
  collection(
    firestore,
    getCallsCollection(userUid, callConfigUid)
  ).withConverter(oneToOneConverter<Call<T>>());

export const getWhatsAppConfigCollectionReference = (
  firestore: Firestore,
  userUid: string
): CollectionReference<WhatsAppConfig> =>
  collection(firestore, getWhatsAppConfigCollection(userUid)).withConverter(
    oneToOneConverter<WhatsAppConfig>()
  );

export const getWhatsAppMessageCollectionReference = <T>(
  firestore: Firestore,
  userUid: string,
  configUid: string
): CollectionReference<WhatsAppMessage<T>> =>
  collection(
    firestore,
    getWhatsAppMessagesCollection(userUid, configUid)
  ).withConverter(oneToOneConverter<WhatsAppMessage<T>>());
