import React from 'react';
import Signup from './components/Signup';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Success from './components/Success';
import Home from './components/Home';

const FaceCam = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' exact element={<Home/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/success' element={<Success/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default FaceCam;
