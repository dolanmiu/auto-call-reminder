// Needed because the cron library does not make it in a good format

export const cleanCron = (cronString: string): string => {
  const newArr = cronString.replace(/\?/g, "*").split(" ");
  newArr.pop();
  return newArr.join(" ");
};
