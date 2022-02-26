// https://stackoverflow.com/questions/41742390/javascript-to-check-if-pwa-or-mobile-web
export const isInStandaloneMode = (): boolean =>
  window.matchMedia('(display-mode: standalone)').matches ||
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window.navigator as any).standalone ||
  document.referrer.includes('android-app://');
