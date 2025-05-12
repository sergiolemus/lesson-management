"use client";

import React, { useState } from "react";
import dayjs from "dayjs";
import { Box, Button, Modal } from "@mui/material";
import { SlotInfo } from "./SlotInfo";
import { Student } from "@/lib/types/Student";

export const Slot: React.FC<{
  id: string;
  startDate: number;
  booked: number;
  coachId: string;
  studentId: string;
  onReserve?: () => void;
}> = ({ id, startDate, booked, studentId }) => {
  const [openModal, setOpenModal] = useState(false);

  const [student, setStudent] = useState<Student>({
    name: "",
    phone_number: "",
  });

  const handleOpen = async () => {
    const res = await fetch(`/api/users/${studentId}`, { method: "GET" });
    const student = await res.json();

    setStudent(student);
    setOpenModal(true);
  };

  const handleClose = () => setOpenModal(false);

  const date = dayjs.unix(startDate);
  const past = date.isBefore(dayjs());

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOpenModal(false);
  };

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
              title="Feedback"
              date={date}
              studentName={student.name}
              phoneNumber={student.phone_number}
            />
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Button type="submit" fullWidth variant="contained">
                Submit
              </Button>
            </Box>
          </Box>
        </Modal>
      </>
    );
  }

  return (
    <Button key={id} disabled={past} variant="outlined">
      {dayjs.unix(Number(startDate)).format("hh:mm A")}
    </Button>
  );
};
