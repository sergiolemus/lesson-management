"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import Cookies from "js-cookie";

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
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          gap: 2,
        }}
      >
        <Card variant="outlined" sx={{ width: "400px", padding: "16px" }}>
          <CardContent>
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
              Calendar
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: 2,
              }}
            >
              <FormControl>
                <InputLabel htmlFor="role">Select Role</InputLabel>
                <Select
                  id="role"
                  name="role"
                  value={role}
                  label="Select Role"
                  onChange={handleRoleChange}
                >
                  <MenuItem value={"coach"}>Coach</MenuItem>
                  <MenuItem value={"student"}>Student</MenuItem>
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="id">Select User</InputLabel>
                <Select
                  id="id"
                  name="id"
                  value={id}
                  label="Select User"
                  onChange={handleUserChange}
                >
                  {users.map(({ id, name }) => (
                    <MenuItem key={id} value={id}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={id === ""}
              >
                Sign in
              </Button>
            </Box>
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ width: "400px", padding: "16px" }}>
          <CardContent>
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
              Calendar
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: 2,
              }}
            >
              <FormControl>
                <InputLabel htmlFor="role">Select Role</InputLabel>
                <Select
                  id="role"
                  name="role"
                  value={role}
                  label="Select Role"
                  onChange={handleRoleChange}
                >
                  <MenuItem value={"coach"}>Coach</MenuItem>
                  <MenuItem value={"student"}>Student</MenuItem>
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="id">Select User</InputLabel>
                <Select
                  id="id"
                  name="id"
                  value={id}
                  label="Select User"
                  onChange={handleUserChange}
                >
                  {users.map(({ id, name }) => (
                    <MenuItem key={id} value={id}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={id === ""}
              >
                Sign in
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
