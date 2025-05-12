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
import DoneIcon from "@mui/icons-material/Done";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

export const Slot: React.FC<{
  id: string;
  startDate: number;
  status: string;
  coachId: string;
  studentId: string;
  onReserve?: () => void;
}> = ({ id, startDate, status, coachId, studentId }) => {
  const [openModal, setOpenModal] = useState(false);

  const [student, setStudent] = useState<Student>({
    name: "",
    phone_number: "",
  });

  const [rating, setRating] = useState<number | null>(3);
  const [ratingError, setRatingError] = useState(false);
  const [ratingHelperText, setRatingHelperText] = useState("");

  const [notes, setNotes] = useState("");

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

  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (rating === null) {
      setRatingError(true);
      setRatingHelperText("Please provide a rating");
      return;
    }

    const res = await fetch(`/api/lessons?slot_id=${id}`);
    const [lesson] = await res.json();

    const body = JSON.stringify({
      coach_id: coachId,
      lesson_id: lesson.id,
      satisfaction_rating: rating,
      notes,
    });

    await fetch(`/api/feedback`, {
      method: "POST",
      body,
      headers: {
        "content-type": "application/json",
        "content-length": String(body.length),
      },
    });

    setOpenModal(false);
  };

  if (status === "complete") {
    return (
      <Button
        key={id}
        disabled={past}
        variant="outlined"
        color="secondary"
        startIcon={<DoneIcon />}
        sx={{ px: 0 }}
      >
        {dayjs.unix(Number(startDate)).format("hh:mm A")}
      </Button>
    );
  }

  if (status === "reserved") {
    return (
      <>
        <Button
          key={id}
          variant="outlined"
          onClick={handleOpen}
          sx={{ px: 0 }}
          startIcon={<PendingActionsIcon />}
          color="success"
          {...(past && { color: "warning" })}
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
                  onChange={handleNotesChange}
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
    <Button
      key={id}
      disabled={past}
      variant="outlined"
      sx={{ px: 0 }}
      startIcon={<EventAvailableIcon />}
    >
      {dayjs.unix(Number(startDate)).format("hh:mm A")}
    </Button>
  );
};
