export const toVietnamTimeISO = (date) => {
  if (!date) return null;
  return new Date(date.getTime() + 7 * 60 * 60 * 1000).toISOString();
};
