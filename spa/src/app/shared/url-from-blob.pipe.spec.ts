import { UrlFromBlobPipe } from './url-from-blob.pipe';

describe('UrlFromBlobPipe', () => {
  it('create an instance', () => {
    const pipe = new UrlFromBlobPipe();
    expect(pipe).toBeTruthy();
  });
});
