"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Container, Card, CardContent } from "@mui/material";

export default function Home() {
  const [role, setRole] = useState("coach");
  const [users, setUsers] = useState([]);
  const [id, setId] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const role = String(data.get("role"));
    const userId = String(data.get("id"));

    Cookies.set("token", JSON.stringify({ userId, role }), { path: "/" });
  };

  const handleRoleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value as string);
    setId("");
  };

  const handleUserChange = (event: SelectChangeEvent) => {
    setId(event.target.value as string);
  };

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/users?role=${role}`, { method: "GET" });
      const users = await res.json();

      setUsers(users);
    })();
  }, [role]);

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
