import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/";

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const getUserBoard = () => {
  return axios.get(API_URL + "user", { headers: authHeader() });
};

const getRecruiterBoard = () => {
  return axios.get(API_URL + "recruiter", { headers: authHeader() });
};

const getCandidateBoard = () => {
  return axios.get(API_URL + "candidate", { headers: authHeader() });
};

const UserService = {
  getPublicContent,
  getUserBoard,
  getCandidateBoard,
  getRecruiterBoard,
};

export default UserService;
