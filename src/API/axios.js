// import axios from "axios";

  
//   axios.defaults.headers["Content-Type"] = "application/json";

//   axios.defaults.baseURL = process.env.REACT_APP_URL;

// export default axios;
// In your axios.js file
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_URL, // Make sure this matches your backend URL
  headers: {
    'Content-Type': 'application/json'
  }
});

export default instance;
