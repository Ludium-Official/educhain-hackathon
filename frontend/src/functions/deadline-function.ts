import dayjs from "dayjs";

export const getConvertDeadline = (date: string): string => {
  const now = dayjs();
  const targetDate = dayjs(date);

  if (targetDate.isBefore(now)) {
    return "마감 0일전";
  }

  const daysLeft = targetDate.diff(now, "day");
  return `마감 ${daysLeft}일전`;
};
