// https://stackoverflow.com/questions/43118692/typescript-filter-out-nulls-from-an-array
export const notEmpty = <TValue>(
  value: TValue | null | undefined,
): value is TValue => {
  return value !== null && value !== undefined;
};
