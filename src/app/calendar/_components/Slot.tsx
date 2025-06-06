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
  InputLabel,
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
import { Feedback } from "@/lib/types/Feedback";

export const Slot: React.FC<{
  id: string;
  startDate: number;
  status: string;
  coachId: string;
  studentId: string;
  onFeedbackSubmit: () => void;
}> = ({ id, startDate, status, coachId, studentId, onFeedbackSubmit }) => {
  const [openModal, setOpenModal] = useState(false);

  const [student, setStudent] = useState<Student>({
    name: "",
    phone_number: "",
  });

  const [rating, setRating] = useState<number | null>(3);
  const [ratingError, setRatingError] = useState(false);
  const [ratingHelperText, setRatingHelperText] = useState("");

  const [notes, setNotes] = useState("");
  const [feedback, setFeedback] = useState<Feedback>({
    satisfaction_rating: 0,
    notes: "",
  });

  const date = dayjs.unix(startDate);
  const past = date.isBefore(dayjs());

  const handleOpen = async () => {
    const res = await fetch(`/api/users/${studentId}`, { method: "GET" });
    const student = await res.json();

    setStudent(student);
    setOpenModal(true);
    setRating(3);
  };

  const handleClose = () => setOpenModal(false);

  const handleOpenCompleteSlot = async () => {
    const les = await fetch(`/api/lessons?slot_id=${id}`);
    const [lesson] = await les.json();

    const stud = await fetch(`/api/users/${studentId}`);
    const student = await stud.json();

    const res = await fetch(`/api/feedback?lesson_id=${lesson.id}`);
    const [feedback] = await res.json();

    setStudent(student);
    setFeedback(feedback);
    setOpenModal(true);
  };

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
      notes: notes || "",
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
    onFeedbackSubmit();
  };

  if (status === "complete") {
    return (
      <>
        <Button
          key={id}
          variant="outlined"
          color="secondary"
          startIcon={<DoneIcon />}
          sx={{ px: 0 }}
          onClick={handleOpenCompleteSlot}
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
            <Box>
              <Box sx={{ mb: 1 }}>
                <InputLabel htmlFor="rating" sx={{ fontSize: "small", mb: 1 }}>
                  Rating
                </InputLabel>
                <Rating
                  name="rating"
                  id="rating"
                  disabled
                  value={feedback.satisfaction_rating}
                  onChange={handleRatingChange}
                />
                <FormHelperText sx={{ mx: 0 }}>
                  {ratingHelperText}
                </FormHelperText>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
                <TextField
                  name="notes"
                  id="notes"
                  label="Notes"
                  value={feedback.notes || ""}
                  multiline
                  disabled
                  rows={4}
                />
              </Box>
            </Box>
          </Box>
        </Modal>
      </>
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
