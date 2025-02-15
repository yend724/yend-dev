import { formatDate } from "@/shared/lib/date-formatter";

type Props = {
  date: string;
};
export const FormattedDate: React.FC<Props> = ({ date }) => {
  return <time dateTime={date}>{formatDate(date)}</time>;
};
