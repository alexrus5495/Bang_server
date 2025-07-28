export const getCurrentTime = () => {
  const date = new Date();
  const time = `${date.getHours()}:${date.getMinutes()}`;
  return time;
};
