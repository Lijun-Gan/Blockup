import axios from "axios";

// We've been using this method in previos steps
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const verifyTwoFA = (data) => {
  return axios.patch("/api/users/verifyTwoFA", data);
};

export const signup = (userData) => {
  return axios.post("/api/users/register", userData);
};

export const login = (userData) => {
  return axios.post("/api/users/login", userData);
};

export const  uploadPicture = (data,config) => {
  
  return axios.patch('/api/users/upload', data, config)

}