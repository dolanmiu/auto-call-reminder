import { Timestamp } from "firebase/firestore";

export interface Call {
  readonly createdAt: Timestamp;
  readonly status: string;
}
