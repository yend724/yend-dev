export const share = async (title: string, url: string) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text: title,
        url,
      });
    } catch (err) {
      console.warn(err);
    }
  } else {
    navigator.clipboard.writeText(url);
    alert("URLをコピーしました");
  }
};
