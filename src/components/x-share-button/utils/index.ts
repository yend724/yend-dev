export const generateXUrl = (url: string, text: string) => {
  return new URL(
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url.toString(),
    )}&text=${encodeURIComponent(text)}`,
  ).toString();
};
