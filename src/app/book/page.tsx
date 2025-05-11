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
} from "@mui/material";
import dayjs from "dayjs";
import { getWeek } from "@/lib";
import { Slot, Schedule } from "@/lib/types";

export default function Calendar() {
  const [coaches, setCoaches] = useState([]);
  const [coachId, setCoachId] = useState("");
  const [currentDate, _setCurrentDate] = useState(dayjs());

  const [schedule, setSchedule] = useState<Schedule>({
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  });

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/users?role=coach`, { method: "GET" });
      const coaches = await res.json();

      setCoaches(coaches);
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

      const slots: Slot[] = await res.json();

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
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <FormControl>
                  <InputLabel htmlFor="coach-id">Select</InputLabel>
                  <Select
                    id="coach-id"
                    name="coach-id"
                    value={coachId}
                    label="Select"
                    onChange={(event) => {
                      setCoachId(event.target.value as string);
                    }}
                  >
                    {coaches.map(({ id, name }) => (
                      <MenuItem key={id} value={id}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                        {slots.map(({ id, start_date, booked }) => {
                          if (booked) {
                            return (
                              <Button
                                key={id}
                                variant="outlined"
                                color="success"
                              >
                                {dayjs
                                  .unix(Number(start_date))
                                  .format("hh:mm A")}
                              </Button>
                            );
                          }

                          return (
                            <Button key={id} variant="outlined">
                              {dayjs.unix(Number(start_date)).format("hh:mm A")}
                            </Button>
                          );
                        })}
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
