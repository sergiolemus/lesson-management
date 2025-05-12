"use client";

import React, { useState } from "react";
import dayjs from "dayjs";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Modal,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
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

  const [rating, setRating] = useState<number | null>(3);
  const [ratingError, setRatingError] = useState(false);
  const [ratingHelperText, setRatingHelperText] = useState("");

  const handleOpen = async () => {
    const res = await fetch(`/api/users/${studentId}`, { method: "GET" });
    const student = await res.json();

    setStudent(student);
    setOpenModal(true);
    setRating(3);
  };

  const handleClose = () => setOpenModal(false);

  const date = dayjs.unix(startDate);
  const past = date.isBefore(dayjs());

  const handleRatingChange = (
    _event: React.SyntheticEvent,
    newValue: number | null
  ) => {
    setRating(newValue);
    setRatingError(false);
    setRatingHelperText("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (rating === null) {
      setRatingError(true);
      setRatingHelperText("Please provide a rating");
      return;
    }

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
              title="Lesson"
              date={date}
              studentName={student.name}
              phoneNumber={student.phone_number}
            />
            <Divider sx={{ my: 2 }} />
            <Typography
              id="modal-modal-feedback-title"
              variant="h6"
              component="h2"
              sx={{ mb: 1 }}
            >
              Feedback
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <FormControl required error={ratingError} sx={{ mb: 1 }}>
                <FormLabel htmlFor="rating" sx={{ fontSize: "small", mb: 1 }}>
                  Rating
                </FormLabel>
                <Rating
                  name="rating"
                  id="rating"
                  value={rating}
                  onChange={handleRatingChange}
                />
                <FormHelperText sx={{ mx: 0 }}>
                  {ratingHelperText}
                </FormHelperText>
              </FormControl>
              <FormControl
                sx={{ display: "flex", flexDirection: "column", mb: 2 }}
              >
                <TextField
                  name="notes"
                  id="notes"
                  label="Notes"
                  multiline
                  rows={4}
                />
              </FormControl>
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
