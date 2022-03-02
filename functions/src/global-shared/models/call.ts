export interface Call<T> {
  readonly createdAt: T;
  readonly status: string;
  readonly recordingUrl?: string;
}
