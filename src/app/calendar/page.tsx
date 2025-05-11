"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import dayjs from "dayjs";
import { getWeek } from "@/lib";
import { getUser } from "@/auth/getUser";
import { Slot } from "./_types/Slot";
import { Schedule } from "./_types/Schedule";

export default function Calendar() {
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
      const { userId } = getUser();
      const today = dayjs();

      const { startDate, endDate } = getWeek(today);

      const start_date = startDate.unix();
      const end_date = endDate.unix();

      const res = await fetch(
        `/api/slots?start_date=${start_date}&end_date=${end_date}&coach_id=${userId}`
      );

      const slots: Slot[] = await res.json();

      const scheduleWithSlots = slots.reduce<Schedule>((schedule, slot) => {
        const { start_date } = slot;
        const day = dayjs.unix(start_date).day();

        return { ...schedule, [day]: [slot, ...schedule[day]] };
      }, schedule);

      setSchedule(scheduleWithSlots);
    })();
  }, []);

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
            <Typography component="h2" variant="h5" sx={{ mb: 2 }}>
              Schedule
            </Typography>
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
                          {dayjs()
                            .startOf("w")
                            .add(Number(day), "d")
                            .format("DD")}
                        </Typography>
                      </Box>
                      {slots.map(({ id, start_date }) => (
                        <Card
                          key={id}
                          sx={{ mx: 1, mb: 1, textAlign: "center" }}
                        >
                          {dayjs.unix(Number(start_date)).format("hh:mm A")}
                        </Card>
                      ))}
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
