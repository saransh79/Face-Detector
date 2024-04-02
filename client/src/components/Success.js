import { Button } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { logo } from '../images';

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
      <nav style={{
        // height: "80px",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        padding: "20px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          width: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "5px"
        }}>
          <img src={logo} alt='logo' height="inherit" width={40} />
          <div style={{
            color: "#0096fe",
            fontWeight: "500",
          }}>CODEBUGGED AI</div>
        </div>
      </nav>
      {user ? (<div className='h2'>Welcome <span style={{
        color: "#0096fe",
      }}>{user.name}</span> to <span style={{
        color: "#0096fe",
      }}>CODEBUGGED AI</span></div>) : <div className='h2'>You have been logged out !</div>}
      {user ? <Button variant='outlined' onClick={handleLogout}
        style={{
          borderColor: "white",
          color: 'white'
        }}>Logout</Button> : <Button variant='outlined' onClick={() => { navigate('/login') }} >Login</Button>}
    </div>

  )
}

export default Success