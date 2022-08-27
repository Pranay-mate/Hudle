import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home"

import EventBus from "./common/EventBus";
import CandidateProfile from "./components/CandidateProfile";
import JobCreationForm from "./components/JobCreationForm";
import RecruiterBoard from "./components/RecruitorBoard";
import CandidateViewJobs from "./components/CandidateViewJobs";
import ErrorProfile from "./components/ErrorProfile";
import AppliedJobs from "./components/AppliedJobs";
import axios from 'axios';


const App = () => {
  const [showCandidateBoard, setShowCandidateBoard] = useState(false);
  const [showRecruiterBoard, setShowRecruiterBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [candidateProfile, setCandidateProfile] = useState(undefined);
  
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      getCandidateProfile(user);
      setShowCandidateBoard(user.roles === '1');
      setShowRecruiterBoard(user.roles === '2');
    }
    const candidateProfileData = AuthService.candidateProfile();
    if(candidateProfileData){
      setCandidateProfile(candidateProfileData)
    }    

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, []);

    const getCandidateProfile = (user) => {
    axios.get(`http://localhost:8080/api/getCandidateProfile/`+user.id)
    .then(res => {
        const data = res.data;
        if(data !== ''){
            localStorage.setItem("profile_data", JSON.stringify(res.data));
            setCandidateProfile(data)
        }
    }).catch(e => {
        console.log("e");
    });
  }

  const logOut = () => {
    AuthService.logout();
    setShowCandidateBoard(false);
    setShowRecruiterBoard(false);
    setCurrentUser(undefined);
  };

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark px-2">
        {showCandidateBoard && currentUser?
        <Link to={"/candidateProfile"} className="navbar-brand">
           {currentUser.username.toUpperCase()}
        </Link>
        :
        null
        }

        {showRecruiterBoard && currentUser?
        <Link to={"/recruiter"} className="navbar-brand">
           {currentUser.username.toUpperCase()}
        </Link>
        :
        null
        }
        
        <div className="navbar-nav mr-auto">

          {showCandidateBoard && (
            <>
            <li className="nav-item">
              <Link to={"/candidateProfile"} className="nav-link">
                Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/candidate"} className="nav-link">
                Jobs
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/appliedJobs"} className="nav-link">
                Applied Jobs
              </Link>
            </li>
            </>
          )}

          {showRecruiterBoard && (
            <>
            <li className="nav-item">
              <Link to={"/recruiter"} className="nav-link">
              Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/job_creation_form"} className="nav-link">
              Create New Job
              </Link>
            </li>
            </>
          )}    

        </div>

        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>
                LogOut
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Sign Up
              </Link>
            </li>
          </div>
        )}
      </nav>

      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/candidateProfile" element={<CandidateProfile/>} />
          <Route path="/candidate" element={candidateProfile===undefined?<ErrorProfile />:<CandidateViewJobs/>} />
          <Route path="/appliedJobs" element={<AppliedJobs/>} />
          <Route path="/recruiter" element={<RecruiterBoard/>} />
          <Route path="/job_creation_form" element={<JobCreationForm />} />
        </Routes>
      </div>

    </div>
  );
};

export default App;
