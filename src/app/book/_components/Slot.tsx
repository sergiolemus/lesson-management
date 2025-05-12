"use client";

import React, { useState } from "react";
import dayjs from "dayjs";
import { Box, Button, Modal } from "@mui/material";
import { Coach } from "@/lib/types/Coach";
import { SlotInfo } from "./SlotInfo";

export const Slot: React.FC<{
  id: string;
  startDate: number;
  booked: number;
  coach: Coach;
  onReserve: () => void;
}> = ({ id, startDate, booked, coach, onReserve }) => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const date = dayjs.unix(startDate);
  const past = date.isBefore(dayjs());

  if (booked) {
    return (
      <>
        <Button
          key={id}
          variant="outlined"
          color="success"
          disabled={past}
          onClick={handleOpen}
        >
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
            <SlotInfo
              title="Lesson"
              coachName={coach.name}
              date={date}
              phoneNumber={coach.phone_number}
            />
          </Box>
        </Modal>
      </>
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

    setOpenModal(false);
    onReserve();
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
          <SlotInfo title="Booking" coachName={coach.name} date={date} />
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
