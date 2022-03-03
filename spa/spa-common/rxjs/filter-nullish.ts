/* eslint-disable functional/prefer-readonly-type */
import { Observable, OperatorFunction, UnaryFunction, pipe } from 'rxjs';
import { filter } from 'rxjs/operators';

// https://stackoverflow.com/questions/57999777/filter-undefined-from-rxjs-observable
export const filterNullish = <T>(): UnaryFunction<
  Observable<T | null | undefined>,
  Observable<T>
> =>
  pipe(filter((x) => x != null) as OperatorFunction<T | null | undefined, T>);
