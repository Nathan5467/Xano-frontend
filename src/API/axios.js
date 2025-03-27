import axios from "axios";

  
  axios.defaults.headers["Content-Type"] = "application/json";

  axios.defaults.baseURL = process.env.REACT_APP_URL;

export default axios;
