"use client";

import React from "react";
import dayjs from "dayjs";
import { Button } from "@mui/material";

export const Slot: React.FC<{
  id: string;
  startDate: number;
  booked: number;
}> = ({ id, startDate, booked }) => {
  const past = dayjs.unix(startDate).isBefore(dayjs());

  if (booked) {
    return (
      <Button key={id} variant="outlined" color="success" disabled={past}>
        {dayjs.unix(Number(startDate)).format("hh:mm A")}
      </Button>
    );
  }

  return (
    <Button key={id} disabled={past} variant="outlined">
      {dayjs.unix(Number(startDate)).format("hh:mm A")}
    </Button>
  );
};
