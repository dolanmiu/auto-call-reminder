import {
  FirestoreDataConverter,
  PartialWithFieldValue,
  WithFieldValue,
} from '@angular/fire/firestore';

export const oneToOneConverter = <U>(): FirestoreDataConverter<U> => ({
  toFirestore: (d: U): PartialWithFieldValue<U> | WithFieldValue<U> => d,
  fromFirestore: (snapshot): U => snapshot.data() as U,
});
