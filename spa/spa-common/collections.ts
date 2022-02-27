import { CollectionReference, Firestore, doc } from '@angular/fire/firestore';

import { CallConfig } from '@models';
import { getCallConfigCollection } from '@constants';
import { oneToOneConverter } from '@common';
import { collection } from 'firebase/firestore';

export const getCallConfigCollectionReference = (
  firestore: Firestore,
  userUid: string
): CollectionReference<CallConfig> =>
  collection(firestore, getCallConfigCollection(userUid)).withConverter(
    oneToOneConverter<CallConfig>()
  );
