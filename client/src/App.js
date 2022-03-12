import Login from "./components/login";
import HomePage from "./canvas/HomePage";
import Test from "./canvas/Test"
import Images from "./components/images"
import "./App.css";
import { Container } from "react-bootstrap";
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  BrowserRouter,
} from "react-router-dom";
import React, { Component }  from 'react';

function App() {
  return (
    // <Router>
   <BrowserRouter> 
    {/* <Navbar /> */}
      <Routes>
        <Route exact path="/" element={<HomePage />}></Route>
        <Route path = "/images/:id" element = {<Images/>}/>
        {/* <Route path="/home" element={<Login />}></Route> */}
        {/* <Route exact path='/images' component={<Images/>} /> */}
       
        {/* <Route path = "/images" element = {<Images/>}></Route> */}
      </Routes>
      {/* </Router> */}
    </BrowserRouter>

  );
}
export default App;
