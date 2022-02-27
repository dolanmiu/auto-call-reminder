import { CollectionReference, Firestore, doc } from '@angular/fire/firestore';

import { CallConfig, Call } from '@models';
import { getCallConfigCollection, getCallsCollection } from '@constants';
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
