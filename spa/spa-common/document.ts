import { DocumentReference, Firestore, doc } from '@angular/fire/firestore';

import { UserData, CallConfig, WhatsAppConfig } from '@models';
import {
  getUserDocument,
  getCallConfigDocument,
  getWhatsAppConfigDocument,
} from '@constants';
import { oneToOneConverter } from '@common';

export const getUserDocumentReference = (
  firestore: Firestore,
  userUid: string
): DocumentReference<UserData> =>
  doc(firestore, getUserDocument(userUid)).withConverter(
    oneToOneConverter<UserData>()
  );

export const getCallConfigDocumentReference = (
  firestore: Firestore,
  userUid: string,
  callConfigUid: string
): DocumentReference<CallConfig> =>
  doc(firestore, getCallConfigDocument(userUid, callConfigUid)).withConverter(
    oneToOneConverter<CallConfig>()
  );

export const getWhatsAppConfigDocumentReference = (
  firestore: Firestore,
  userUid: string,
  configUid: string
): DocumentReference<WhatsAppConfig> =>
  doc(firestore, getWhatsAppConfigDocument(userUid, configUid)).withConverter(
    oneToOneConverter<WhatsAppConfig>()
  );
