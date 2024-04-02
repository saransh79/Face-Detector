import React, { useState, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from "react-spinners/ClipLoader";
import TextField from '@mui/material/TextField';
import { Button, Typography } from '@mui/material';
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

const Signup = () => {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [faceAIData, setFaceAIData] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [isloading, setIsLoading] = useState(false);

    useEffect(() => {
        const startCamera = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const currentVideoRef = videoRef.current; // Store a reference to videoRef.current
            if (currentVideoRef) {
                currentVideoRef.srcObject = stream;
            }
        };

        startCamera();

        return () => {
            const currentVideoRef = videoRef.current; // Use the stored reference
            if (currentVideoRef && currentVideoRef.srcObject) {
                const stream = currentVideoRef.srcObject;
                const tracks = stream.getTracks();

                tracks.forEach(track => {
                    track.stop();
                });
            }
        };
    }, []);


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
        ]);

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
            // console.log(faceAIData);
            if (faceAIData.length === 0) {
                setIsLoading(false);
                return toast.error("Face data is required, Please capture face")
            }

            const config = {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
                }
            };

            await axios.post(`${process.env.REACT_APP_BASE_URL}/api/signup`, {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                faceDimensions: Object.values(faceAIData)
            });
            navigate("/login");
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

            <div className='signup-wrapper' style={{
                filter: isloading ? "blur(5px)" : "none",
            }}>
                <div className='signup-left' >
                  {window.innerWidth <= 500 &&  <Typography variant='h3'>Signup</Typography>}
                    <video ref={videoRef} autoPlay muted></video>
                    <canvas ref={canvasRef} style={{ display: 'none' }} width={200} height={200}></canvas>
                    <Button
                        variant='outlined'
                        style={{
                            padding: "10px 20px",
                            color: "#fff",
                            borderColor: "#fff"
                        }}
                        onClick={captureImage}>Click Picture</Button>
                </div>
                <div className='signup-right' >
                  {window.innerWidth >500 &&  <Typography variant='h3'>Signup</Typography>}


                    {capturedImage && (
                        <div style={{
                        }}>
                            <img id='image' src={capturedImage} alt="Captured" style={{
                                borderRadius: "50%",
                                border: "1px solid #fff",
                            }} />
                        </div>
                    )}

                    <div className='signup-form' >
                        <form onSubmit={handleSubmit} style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                        }}>
                            <TextField
                                required
                                variant="outlined"
                                placeholder='Enter your name'
                                type="text"
                                label="Name" name="name"
                                value={formData.name} onChange={handleChange}
                                sx={inputStyles}
                            />
                            <TextField
                                required
                                variant="outlined"
                                placeholder='Enter your email'
                                type="email"
                                label="Email"
                                name="email" value={formData.email} onChange={handleChange}
                                sx={inputStyles}
                            />
                            <TextField
                                required
                                variant="outlined"
                                placeholder='Enter your password'
                                label='Password'
                                type="password" name="password" value={formData.password} onChange={handleChange}
                                sx={inputStyles}
                            />
                            <Button type='submit' variant="contained"
                                sx={{
                                    color: "white",
                                    padding: "10px 0"
                                }}>
                                Send
                            </Button>
                        </form>
                    </div>
                    <div className='h6' onClick={() => { navigate("/login") }}
                        style={{
                            cursor: "pointer",
                            color: "grey"
                        }}>Click here to login</div>

                </div>

            </div>
        </div>
    );
};

export default Signup;
