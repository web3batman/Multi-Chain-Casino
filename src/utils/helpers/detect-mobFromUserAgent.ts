const toMatch = [
  /Android/i,
  /webOS/i,
  /iPhone/i,
  /iPad/i,
  /iPod/i,
  /BlackBerry/i,
  /Windows Phone/i,
  /okhttp/i,
];

export default (userAgent) => {
  return Boolean(
    toMatch.find((toMatchItem) => {
      return userAgent.match(toMatchItem);
    })
  );
};
