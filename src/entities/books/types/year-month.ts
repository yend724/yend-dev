export type YearMonth = {
  year: number;
  month: number;
};

export const yearMonthToString = ({ year, month }: YearMonth): string => {
  return `${year}年${String(month).padStart(2, "0")}月`;
};

export const yearMonthToKey = ({ year, month }: YearMonth): string => {
  return `${year}-${String(month).padStart(2, "0")}`;
};
