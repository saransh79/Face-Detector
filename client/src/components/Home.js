import { Button, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { home } from '../images';
const Home = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: "100vh",
        }}>
            <div style={{
                width: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                flexDirection: "column",
                gap: "3rem",
                textAlign: "center"
            }}>
                <Typography variant='h2'>Verify <span style={{
                    color: "#0096fe",
                }}>anyone</span> from <span style={{
                    color: "#0096fe",
                }}>anywhere</span> with <span style={{
                    color: "#0096fe",
                }}>face recognition</span></Typography>
                <div style={{
                    display: 'flex',
                    alignItems: "center",
                    justifyContent: "space-around",
                    gap: "3rem"
                }}>
                    <Button
                        variant='outlined' size='large'
                        style={{
                            padding: "15px 40px",
                            color: "#fff",
                            borderColor: "#fff"
                        }}
                        onClick={() => navigate("/signup")}>Signup</Button>
                    <Button
                        variant='outlined' size='large'
                        style={{
                            padding: "15px 40px",
                            color: "#fff",
                            borderColor: "#fff"
                        }}
                        onClick={() => navigate("/login")}>Login</Button>
                </div>
            </div>

            <div style={{
                width: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <img src={home} alt='homepage' width={700} height={700} />
            </div>
        </div>
    )
}

export default Home