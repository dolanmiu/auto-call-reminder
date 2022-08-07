import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '@angular/fire/auth';

import { WhatsAppChat } from '@models';

export const getMiniAppUidFromRoute = (route: ActivatedRoute): string =>
  getParamFromRoute(route, 'miniAppUid', 'unknown');

export const getParamFromRoute = <T>(
  route: ActivatedRoute,
  name: string,
  defaultValue: T
): string | T => {
  let output;
  let currRoute: ActivatedRoute | null = route;

  while (output === undefined && currRoute) {
    const curr = currRoute.snapshot.paramMap.get(name);

    if (curr !== null) {
      output = curr;
    } else {
      currRoute = currRoute.parent;
    }
  }

  return output ?? defaultValue;
};

export const getUserFromRouteSnapshotData = (
  route: ActivatedRouteSnapshot
): User => getDataFromRouteSnapshot(route, 'user');

export const getDataFromRouteSnapshot = <T, Y>(
  route: ActivatedRouteSnapshot,
  name: string
): T => {
  let output;
  let currRoute: ActivatedRouteSnapshot | null = route;

  while (output === undefined && currRoute) {
    const curr = currRoute.data[name];
    console.log(currRoute);
    if (curr !== undefined) {
      output = curr;
    } else {
      currRoute = currRoute.parent;
    }
  }

  if (!output) {
    throw new Error(`Data not found in route: ${name}`);
  }

  return output;
};

export const getUserFromRouteData = (route: ActivatedRoute): User =>
  getDataFromRoute(route, 'user');

export const getChatsFromRoute = (route: ActivatedRoute): WhatsAppChat[] =>
  getDataFromRoute(route, 'chats');

export const getDataFromRoute = <T>(route: ActivatedRoute, name: string): T => {
  let output: T | undefined;
  let currRoute: ActivatedRoute | null = route;

  while (output === undefined && currRoute) {
    console.log(currRoute.snapshot.data);
    const curr = currRoute.snapshot.data[name];

    if (curr !== undefined) {
      output = curr;
    } else {
      currRoute = currRoute.parent;
    }
  }

  if (!output) {
    throw new Error(`Data not found in route: ${name}`);
  }

  return output;
};

export const getQueryParamFromRoute = <T>(
  route: ActivatedRoute,
  name: string,
  defaultValue: T
): string | T => {
  const output = route.snapshot.queryParamMap.get(name);

  return output ?? defaultValue;
};
