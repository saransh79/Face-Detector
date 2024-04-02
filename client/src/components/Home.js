import { Button, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { home } from '../images';
import "./styles.css";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className='home-wrapper'
        >
            <div
                className='home-left'>
                <div className='h2'>Verify <span style={{
                    color: "#0096fe",
                }}>anyone</span> from <span style={{
                    color: "#0096fe",
                }}>anywhere</span> with <span style={{
                    color: "#0096fe",
                }}>face recognition</span></div>
                <div
                    className='home-btn' style={{
                        display: 'flex',
                        alignItems: "center",
                        justifyContent: "space-around",
                        gap: "3rem"
                    }}
                >
                    <Button
                        variant='outlined'
                        size="large"
                        style={{
                            padding: window.innerWidth > 500 && "15px 40px",
                            color: "#fff",
                            borderColor: "#fff",
                        }}
                        onClick={() => navigate("/signup")}>Signup</Button>
                    <Button
                        variant='outlined'
                        size="large"
                        style={{
                            padding: window.innerWidth > 500 && "15px 40px",
                            color: "#fff",
                            borderColor: "#fff",
                        }}
                        onClick={() => navigate("/login")}>Login</Button>
                </div>
            </div>

            <div
                className='home-right'>
                <img src={home} alt='homepage' width={700} height={700} />
            </div>
        </div>
    )
}

export default Home