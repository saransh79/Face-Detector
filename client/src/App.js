import React from 'react';
import Signup from './components/Signup';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Success from './components/Success';
import Home from './components/Home';
import "./App.css";

const FaceCam = () => {
  return (
    <div >
      <div className='App'>
        <BrowserRouter>
          <Routes>
            <Route path='/' exact element={<Home />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
            <Route path='/success' element={<Success />} />
          </Routes>
        </BrowserRouter>
      </div>
      <div className='footer'>
        <div>Made with ❤️ by <a style={{
                    color: "#0096fe",
                    textDecoration: "none",
                }} href='https://portfolio-one-steel-15.vercel.app/'>@Saransh Gangwar</a></div>
      </div>
    </div>

  );
};

export default FaceCam;
