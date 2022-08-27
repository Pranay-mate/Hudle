import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

const register = (username, email,role,mob_no, password) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    role,
    mob_no,
    password,
  });
};

const login = (username, password) => {
  return axios
    .post(API_URL + "signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("profile_data");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const candidateProfile = () => {
  return JSON.parse(localStorage.getItem("profile_data"));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  candidateProfile,
};

export default AuthService;
