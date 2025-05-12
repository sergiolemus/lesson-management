"use client";

import React, { FormEvent, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
  Button,
  Popover,
  FormControl,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import dayjs from "dayjs";
import { getWeek } from "@/lib";
import { getUser } from "@/auth/getUser";
import { Slot as TSlot, Schedule } from "@/lib/types";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import {
  DateCalendar,
  LocalizationProvider,
  TimeField,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Slot } from "./_components/Slot";
import { useRouter } from "next/navigation";
import LogoutIcon from "@mui/icons-material/Logout";
import FaceIcon from "@mui/icons-material/Face";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(dayjs().minute(0));
  const [selectedTime, setSelectedTime] = useState(currentDate);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [addedSlot, setAddedSlot] = useState("");
  const [userId, setUserId] = useState(getUser());
  const [submittedFeedbackSlotId, setSubmittedFeedbackSlotId] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [openErrorSnackBar, setOpenErrorSnackBar] = useState(false);
  const [userName, setUserName] = useState("");

  const router = useRouter();

  const open = Boolean(anchorEl);
  const id = open ? "date-popover" : undefined;

  const [schedule, setSchedule] = useState<Schedule>({
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  });

  const handleLogout = () => {
    router.push("/");
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedTime(dayjs(selectedTime).add(2, "h"));
  };

  const handleCloseSnackBar = () => setOpenSnackBar(false);
  const handleCloseErrorSnackBar = () => setOpenErrorSnackBar(false);

  const handleFeedbackSubmit = (id: string) => () => {
    setSubmittedFeedbackSlotId(id);
    setSnackBarMessage("Feedback Submitted!");
    setOpenSnackBar(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const hour = selectedTime.get("h");
    const minute = selectedTime.get("m");

    const start_date = dayjs(currentDate)
      .set("h", hour)
      .set("m", minute)
      .set("s", 0);

    const end_date = start_date.add(2, "h");

    const body = JSON.stringify({
      start_date: start_date.unix(),
      end_date: end_date.unix(),
    });

    const res = await fetch(`/api/slots`, {
      method: "POST",
      body,
      headers: {
        "content-type": "application/json",
        "content-length": String(body.length),
      },
    });

    if (res.status === 409) {
      setOpenErrorSnackBar(true);
      handleClose();
      return;
    }

    const { id }: TSlot = await res.json();

    setAddedSlot(id);
    setSnackBarMessage("Slot Created!");
    setOpenSnackBar(true);
    handleClose();
  };

  useEffect(() => {
    const { role, userId } = getUser();
    if (role === "student") router.push("/");

    (async () => {
      const res = await fetch(`/api/users/${userId}`);
      const user = await res.json();

      setUserName(user.name);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { userId } = getUser();
      const { startDate, endDate } = getWeek(currentDate);

      const start_date = startDate.unix();
      const end_date = endDate.unix();

      const res = await fetch(
        `/api/slots?start_date=${start_date}&end_date=${end_date}&coach_id=${userId}`
      );

      const slots: TSlot[] = await res.json();

      const scheduleWithSlots = slots.reduce<Schedule>(
        (schedule, slot) => {
          const { start_date } = slot;
          const day = dayjs.unix(start_date).day();

          return {
            ...schedule,
            [day]: [slot, ...schedule[day]].sort(
              (a, b) => a.start_date - b.start_date
            ),
          };
        },
        { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }
      );

      setSchedule(scheduleWithSlots);
      setUserId(userId);
    })();
  }, [currentDate, addedSlot, userId, submittedFeedbackSlotId]);

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          gap: 2,
        }}
      >
        <Card variant="outlined" sx={{ maxWidth: "100%", padding: "16px" }}>
          <CardContent sx={{ width: "100vh" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  flexGrow: 6,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                  }}
                >
                  <Typography component="h2" variant="h5">
                    {userName}
                  </Typography>
                  <Chip icon={<FaceIcon />} label="Coach" />
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  width: "14.25%",
                }}
              >
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                >
                  Logout
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  flexGrow: 1,
                }}
              >
                <Button
                  variant="contained"
                  fullWidth
                  onClick={(event) => setAnchorEl(event.currentTarget)}
                  startIcon={<EditCalendarIcon />}
                >
                  Create Slot
                </Button>
              </Box>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <FormControl>
                      <DateCalendar
                        sx={{ height: "290px", mb: 1 }}
                        value={currentDate}
                        onChange={(newValue) =>
                          setCurrentDate(dayjs(newValue).second(0))
                        }
                      />
                    </FormControl>
                    <FormControl>
                      <TimeField
                        label="Book Slot"
                        value={selectedTime}
                        sx={{ mx: 2 }}
                        onChange={(newValue) =>
                          setSelectedTime(dayjs(newValue).second(0))
                        }
                      />
                    </FormControl>
                    <Button type="submit" variant="contained" sx={{ m: 2 }}>
                      Create
                    </Button>
                  </Box>
                </LocalizationProvider>
              </Popover>
            </Box>
            <Grid container columns={7}>
              {Object.entries(schedule).map(([day, slots]) => (
                <Grid key={day} size={1} sx={{ height: "500px" }}>
                  <Card
                    variant="outlined"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <CardContent sx={{ width: "100%", p: 0 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          m: 2,
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        <Typography
                          component="h2"
                          variant="h6"
                          textAlign="center"
                        >
                          {currentDate.day(Number(day)).format("ddd")}
                        </Typography>
                        <Typography
                          component="h2"
                          variant="h6"
                          textAlign="center"
                        >
                          {currentDate
                            .startOf("w")
                            .add(Number(day), "d")
                            .format("DD")}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          gap: 1,
                          mx: 1,
                        }}
                      >
                        {slots.map(
                          ({
                            id,
                            start_date,
                            status,
                            coach_id,
                            student_id,
                          }) => (
                            <Slot
                              id={id}
                              key={id}
                              startDate={start_date}
                              status={status}
                              coachId={coach_id}
                              studentId={student_id}
                              onFeedbackSubmit={handleFeedbackSubmit(id)}
                            />
                          )
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Box>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={openErrorSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseErrorSnackBar}
      >
        <Alert
          onClose={handleCloseErrorSnackBar}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Entry Creation Failed! Overlapping Entry.
        </Alert>
      </Snackbar>
    </Container>
  );
}
