import { Dayjs } from "dayjs";

export type GetWeek = (today: Dayjs) => { startDate: Dayjs; endDate: Dayjs };

export const getWeek: GetWeek = (today) => ({
  startDate: today.startOf("w"),
  endDate: today.endOf("w"),
});
