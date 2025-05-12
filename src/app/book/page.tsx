"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
  Button,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  Popover,
} from "@mui/material";
import dayjs from "dayjs";
import { getWeek } from "@/lib";
import { Slot as TSlot, Schedule } from "@/lib/types";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import { Slot } from "./_components/Slot";
import { Coach } from "@/lib/types/Coach";

export default function Book() {
  const [coaches, setCoaches] = useState<{ [key: string]: Coach }>({});
  const [coachId, setCoachId] = useState("");
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

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

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/users?role=coach`, { method: "GET" });
      const coaches = await res.json();

      const results = coaches.reduce(
        (results: { [key: string]: Coach }, coach: Coach) => ({
          ...results,
          [coach.id]: coach,
        }),
        {}
      );

      setCoaches(results);
      setCoachId(coaches[0].id);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!coachId) return;

      const { startDate, endDate } = getWeek(currentDate);

      const start_date = startDate.unix();
      const end_date = endDate.unix();

      const res = await fetch(
        `/api/slots?start_date=${start_date}&end_date=${end_date}&coach_id=${coachId}`
      );

      const slots: TSlot[] = await res.json();

      const scheduleWithSlots = slots.reduce<Schedule>(
        (schedule, slot) => {
          const { start_date } = slot;
          const day = dayjs.unix(start_date).day();

          return { ...schedule, [day]: [slot, ...schedule[day]] };
        },
        { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }
      );

      setSchedule(scheduleWithSlots);
    })();
  }, [currentDate, coachId]);

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
                flexDirection: "column",
                mb: 2,
              }}
            >
              <Box sx={{ mb: 2 }}>
                <Typography component="h2" variant="h5">
                  Book Coach
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <FormControl sx={{ flexGrow: 1 }}>
                  <InputLabel htmlFor="coach-id">Coach</InputLabel>
                  <Select
                    id="coach-id"
                    name="coach-id"
                    value={coachId}
                    label="Coach"
                    onChange={(event) => {
                      setCoachId(event.target.value as string);
                    }}
                  >
                    {Object.values(coaches).map(({ id, name }) => (
                      <MenuItem key={id} value={id}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={(event) => setAnchorEl(event.currentTarget)}
                  startIcon={<EditCalendarIcon />}
                >
                  Date
                </Button>
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
                      onSubmit={async () => {
                        handleClose();
                      }}
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
                          disablePast
                          value={currentDate}
                          onChange={(newValue) =>
                            setCurrentDate(dayjs(newValue))
                          }
                        />
                      </FormControl>
                    </Box>
                  </LocalizationProvider>
                </Popover>
              </Box>
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
                          {dayjs().day(Number(day)).format("ddd")}
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
                        {slots.map(({ id, start_date, booked }) => (
                          <Slot
                            id={id}
                            key={id}
                            startDate={start_date}
                            booked={booked}
                            coach={coaches[coachId]}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
