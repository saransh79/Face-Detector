import { Button, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      gap: "4rem",
      textAlign: "center"
  }}>
      <Typography variant='h2'>Welcome <span style={{
        color: "#0096fe",
      }}>{user.name}</span></Typography>
      <Button variant='outlined' onClick={handleLogout}>Logout</Button>
    </div>
  )
}

export default Success