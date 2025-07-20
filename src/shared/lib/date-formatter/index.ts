export const formatDate = (date: string, format: string = "YYYY/MM/DD") => {
  const d = new Date(date);
  const year = String(d.getFullYear());
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  const formattedDate = format
    .replace(/YYYY/g, year)
    .replace(/MM/g, month)
    .replace(/DD/g, day);

  return formattedDate;
};
