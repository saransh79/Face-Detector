import React, { useState, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from "react-spinners/ClipLoader";
import TextField from '@mui/material/TextField';
import { Button, Typography } from '@mui/material';
import { emailLogin, login } from '../images';
import "./styles.css";

// Define constant object for common CSS styles
const inputStyles = {
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'white', // Border color
        },
        '& input': {
            color: 'white', // Font color
        },
        '& input::placeholder': {
            color: 'white', // Placeholder color
        },
    },
    '& .MuiInputLabel-root': {
        color: 'white', // Label color
    },
};

const Login = () => {
    const [showCamera, setShowCamera] = useState(true);
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [faceAIData, setFaceAIData] = useState([]);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isloading, setIsLoading] = useState(false);

    useEffect(() => {
        const startCamera = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        };

        startCamera();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject;
                const tracks = stream.getTracks();

                tracks.forEach(track => {
                    track.stop();
                });
            }
        };
    }, [showCamera]);


    const captureImage = async () => {
        setIsLoading(true);

        const context = canvasRef.current.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const imageDataURL = canvasRef.current.toDataURL('image/png');
        setCapturedImage(imageDataURL);

        await Promise.all([
            faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
            faceapi.nets.ageGenderNet.loadFromUri('./models'),
        ])
        const input = document.getElementById("image");
        const faceData = await faceapi.detectAllFaces(input).withFaceLandmarks().withFaceDescriptors().withAgeAndGender();

        if (faceData.length > 0) {
            const descriptor = faceData[0].descriptor;
            console.log(descriptor);
            setFaceAIData(descriptor);

            toast.success('Face Detected Successfully');
        }
        else {
            toast.error("Face not detected, Please try again!");
        }
        setIsLoading(false);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            // console.log(formData);
            // console.log(faceAIData);
            // if (faceAIData.length === 0) {
            //     setIsLoading(false);
            //     return toast.error("Face not detected, try again or use email authentication")
            // }

            const config = {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
                }
            };

            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/login`, {
                email: formData.email,
                password: formData.password,
                faceAIData: Object.values(faceAIData)
            });
            // console.log(response.data);
            localStorage.setItem("user", JSON.stringify(response.data));

            navigate("/success")
        } catch (error) {
            console.log(error);
            if (error.response)
                toast.error(error.response.data)
            else toast.error(error.message);
        }
        setIsLoading(false);
    };
    return (
        <div>
            <ToastContainer
                autoClose={2000}
                draggable
            />

            {isloading && <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 999,
            }}>
                <ClipLoader
                    loading={isloading}
                    size={90}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                    color='#d63636'
                />
            </div>}

            <div className='login-wrapper' style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                minHeight: "100vh",
                filter: isloading ? "blur(5px)" : "none",
            }}>
                <div className='login-left' style={{
                    // width: "50%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "2rem"
                }}>
                    <Typography className='login-text-fullscreen' variant='h3'>Login</Typography>
                    {showCamera ? (capturedImage ? (
                        <div>
                            <img id='image' src={capturedImage} alt="Captured" width={300} height={300} style={{
                                borderRadius: "50%",
                                border: "1px solid #fff",
                            }} />
                        </div>
                    ) : (
                        <div>
                            <img src={login} alt='login'
                                width={300} height={300} style={{
                                    borderRadius: "50%",
                                    border: "1px solid #fff",
                                }}
                            />
                        </div>
                    )) : (
                        <form onSubmit={handleSubmit} style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                            width: "80%",
                        }}>
                            <TextField
                                required
                                variant="outlined"
                                placeholder='Enter your email'
                                type="email"
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                sx={inputStyles}
                            />
                            <TextField
                                required
                                variant="outlined"
                                placeholder='Enter your password'
                                type="password"
                                label="Password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                sx={inputStyles}
                            />
                        </form>
                    )}
                    <Button variant='contained' onClick={handleSubmit}
                        style={{
                            padding: "10px 0",
                            color: "#fff",
                            borderColor: "#fff",
                            width: "80%"
                        }}>Login</Button>

                    {!showCamera ? <Button variant='outlined' onClick={() => setShowCamera(true)}
                        style={{
                            padding: "10px 0",
                            color: "#fff",
                            borderColor: "#fff",
                            width: "80%"
                        }}>Login with face</Button> :
                        <Button variant='outlined' onClick={() => {
                            setShowCamera(false);
                            setCapturedImage(null);
                            setFaceAIData([]);
                        }}
                            style={{
                                padding: "10px 0",
                                color: "#fff",
                                borderColor: "#fff",
                                width: "80%"
                            }}>Login with email</Button>}
                    <div className='h6' onClick={() => { navigate("/signup") }}
                        style={{
                            cursor: "pointer",
                            // fontSize: "16px",
                            color: "grey"
                        }}>Click here to signup</div>
                </div>
                {showCamera ?
                    (<div style={{
                        // width: "50%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "3rem"
                    }}
                    className='login-right'>
                        <Typography className='login-text' variant='h3'>Login</Typography>
                        <video ref={videoRef} autoPlay muted></video>
                        <canvas ref={canvasRef} style={{ display: 'none' }} width={300} height={400}></canvas>
                        <Button variant='outlined' onClick={captureImage}
                            style={{
                                padding: "10px 20px",
                                color: "#fff",
                                borderColor: "#fff"
                            }}>Click Picture</Button>
                    </div>) :
                    (<div className='login-image-div' style={{
                        width: "50%",
                        display: "flex",
                        alignItems: 'center',
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: "2rem"
                    }}><Typography className='login-text' variant='h3'>Login</Typography>
                        <img src={emailLogin} alt='email-login' />
                    </div>)
                }

            </div>

            {/* {!showCamera && <div>
                <Typography variant='h3'>Login</Typography>
                
            </div>} */}



        </div>
    )
}

export default Login