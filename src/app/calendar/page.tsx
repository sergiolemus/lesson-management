"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Container, Card, CardContent } from "@mui/material";
import dayjs from "dayjs";
import { getWeek } from "../lib";

export default function Calendar() {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    (async () => {
      const today = dayjs();
      const { startDate, endDate } = getWeek(today);

      const start_date = startDate.unix();
      const end_date = endDate.unix();

      const res = await fetch(
        `/api/slots?start_date=${start_date}&end_date=${end_date}`
      );

      const slots = await res.json();

      setSlots(slots);

      setUsers(users);
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
          <CardContent>
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
              Schedule
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                height: "512px",
                gap: 2,
              }}
            >
              <Card
                variant="outlined"
                sx={{ width: "256px", padding: "16px" }}
              ></Card>
              <Card
                variant="outlined"
                sx={{ width: "256px", padding: "16px" }}
              ></Card>
              <Card
                variant="outlined"
                sx={{ width: "256px", padding: "16px" }}
              ></Card>
              <Card
                variant="outlined"
                sx={{ width: "256px", padding: "16px" }}
              ></Card>
              <Card
                variant="outlined"
                sx={{ width: "256px", padding: "16px" }}
              ></Card>
              <Card
                variant="outlined"
                sx={{ width: "256px", padding: "16px" }}
              ></Card>
              <Card
                variant="outlined"
                sx={{ width: "256px", padding: "16px" }}
              ></Card>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
