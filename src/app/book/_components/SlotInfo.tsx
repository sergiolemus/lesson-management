import React from "react";
import { Dayjs } from "dayjs";
import { Box, Button, Modal, Typography } from "@mui/material";
import { formatPhoneNumber } from "@/lib/phone/format";

export const SlotInfo: React.FC<{
  title: string;
  coachName: string;
  date: Dayjs;
  phoneNumber?: string;
}> = ({ title, coachName, date, phoneNumber }) => {
  return (
    <>
      <Typography
        id="modal-modal-title"
        variant="h6"
        component="h2"
        sx={{ mb: 2 }}
      >
        {title}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Box
          id="modal-modal-coach"
          sx={{ display: "flex", flexDirection: "row" }}
        >
          <Typography fontWeight="bold">Coach:</Typography>
          &nbsp;
          <Typography>{coachName}</Typography>
        </Box>
        {phoneNumber && (
          <Box
            id="modal-modal-coach"
            sx={{ display: "flex", flexDirection: "row" }}
          >
            <Typography fontWeight="bold">Phone:</Typography>
            &nbsp;
            <Typography>{formatPhoneNumber(phoneNumber)}</Typography>
          </Box>
        )}
        <Box
          id="modal-modal-date"
          sx={{ display: "flex", flexDirection: "row" }}
        >
          <Typography fontWeight="bold">Date:</Typography>
          &nbsp;
          <Typography>{date.format("LL")}</Typography>
        </Box>
        <Box
          id="modal-modal-time"
          sx={{ display: "flex", flexDirection: "row" }}
        >
          <Typography fontWeight="bold">Time:</Typography>
          &nbsp;
          <Typography>{`${date.format("LT")} - ${date
            .add(2, "h")
            .format("LT")}`}</Typography>
        </Box>
      </Box>
    </>
  );
};
