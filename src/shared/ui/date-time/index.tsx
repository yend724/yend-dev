import { formatDate } from "@/shared/lib/date-formatter";

type DateFormat = string;

type Props = {
  date: string;
  format?: DateFormat;
};

export const FormattedDate: React.FC<Props> = ({ date, format }) => {
  return <time dateTime={date}>{formatDate(date, format)}</time>;
};
