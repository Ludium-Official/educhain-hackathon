import dayjs from "dayjs";

export const getConvertDeadline = (date: string): number => {
  const now = dayjs();
  const targetDate = dayjs(date);

  if (targetDate.isBefore(now)) {
    return 0;
  }

  const daysLeft = targetDate.diff(now, "day");
  return daysLeft;
};
