"use client";

import React, { useState } from "react";
import dayjs from "dayjs";
import { Box, Button, Modal } from "@mui/material";
import { Coach } from "@/lib/types/Coach";
import { SlotInfo } from "./SlotInfo";
import DoneIcon from "@mui/icons-material/Done";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

export const Slot: React.FC<{
  id: string;
  startDate: number;
  status: string;
  coach: Coach;
  onReserve: () => void;
}> = ({ id, startDate, status, coach, onReserve }) => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const date = dayjs.unix(startDate);
  const past = date.isBefore(dayjs());

  if (status === "reserved" || status === "complete") {
    return (
      <>
        <Button
          key={id}
          variant="outlined"
          onClick={handleOpen}
          sx={{ px: 0 }}
          color="success"
          startIcon={<PendingActionsIcon />}
          {...(status === "complete" && {
            color: "secondary",
            startIcon: <DoneIcon />,
          })}
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
      <Button
        key={id}
        disabled={past}
        variant="outlined"
        onClick={handleOpen}
        sx={{ px: 0 }}
        startIcon={<EventAvailableIcon />}
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
