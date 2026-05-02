"use client";

import { useEffect } from "react";
import { Log, setLoggerAuthToken } from "logging_middleware";
import { Button, Container, Typography, Box } from "@mui/material";

export default function Home() {
  const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJoejAwMDNAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwODI1OCwiaWF0IjoxNzc3NzA3MzU4LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZTUyMDE5NTQtM2Y4Zi00MTJiLTg2MTItNzEyNGI2MzA1YTlmIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiaGltYW5zaCIsInN1YiI6Ijc2NzVjOWM3LWMyMDQtNDgzNC1iNjYzLTQ3NzMwYWZlZjNmZCJ9LCJlbWFpbCI6Imh6MDAwM0Bzcm1pc3QuZWR1LmluIiwibmFtZSI6ImhpbWFuc2giLCJyb2xsTm8iOiJyYTIzMTEwMDMwMzAyNTciLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiI3Njc1YzljNy1jMjA0LTQ4MzQtYjY2My00NzczMGFmZWYzZmQiLCJjbGllbnRTZWNyZXQiOiJlc3RzSHFreG5jaERBYmt2In0.PhBWxosFjMwOZSey32JTKozXWhw2eBJAWxMtv-kvf4k";

  useEffect(() => {
    setLoggerAuthToken(AUTH_TOKEN);
    Log("frontend", "info", "page", "Notification Frontend mounted successfully.");
  }, []);

  const handleTestLogger = async () => {
    try {
      await Log("frontend", "info", "component", "User triggered manual test log event.");
      alert("Logger test executed. Check network tab for 200 OK.");
    } catch (error) {
      await Log("frontend", "error", "component", "Manual log test failed to execute.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Notifications Portal
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Connected to Central Logging Middleware
        </Typography>
        
        <Button variant="contained" size="large" onClick={handleTestLogger}>
          Trigger Test Log
        </Button>
      </Box>
    </Container>
  );
}