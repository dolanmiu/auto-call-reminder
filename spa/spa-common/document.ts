import { DocumentReference, Firestore, doc } from '@angular/fire/firestore';

import { UserData } from '@models';
import { getUserDocument } from '@constants';
import { oneToOneConverter } from '@common';

export const getUserDocumentReference = (
  firestore: Firestore,
  userUid: string
): DocumentReference<UserData> =>
  doc(firestore, getUserDocument(userUid)).withConverter(
    oneToOneConverter<UserData>()
  );
