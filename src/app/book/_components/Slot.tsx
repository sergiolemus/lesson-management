"use client";

import React, { useState } from "react";
import dayjs from "dayjs";
import { Box, Button, Modal, Typography } from "@mui/material";
import { Coach } from "@/lib/types/Coach";

export const Slot: React.FC<{
  id: string;
  startDate: number;
  booked: number;
  coach: Coach;
}> = ({ id, startDate, booked, coach }) => {
  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const date = dayjs.unix(startDate);
  const past = date.isBefore(dayjs());

  if (booked) {
    return (
      <Button key={id} variant="outlined" color="success" disabled={past}>
        {dayjs.unix(Number(startDate)).format("hh:mm A")}
      </Button>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const body = JSON.stringify({
      slot_id: id,
      coach_id: coach.id,
    });

    await fetch(`/api/lessons`, {
      method: "POST",
      body,
      headers: {
        "content-type": "application/json",
        "content-length": String(body.length),
      },
    });
  };

  return (
    <>
      <Button key={id} disabled={past} variant="outlined" onClick={handleOpen}>
        {dayjs.unix(Number(startDate)).format("hh:mm A")}
      </Button>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ mb: 2 }}
          >
            Booking
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box
              id="modal-modal-coach"
              sx={{ display: "flex", flexDirection: "row" }}
            >
              <Typography fontWeight="bold">Coach:</Typography>
              &nbsp;
              <Typography>{coach.name}</Typography>
            </Box>
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
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Button type="submit" fullWidth variant="contained">
              Reserve
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};
