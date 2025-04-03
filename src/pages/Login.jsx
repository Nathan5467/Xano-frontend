import logo from "../assets/logo-sm.png";
import React, { useEffect, useState } from "react";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "../API/axios";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import googleIcom from "../assets/goolgeicon.png";
import facebookIcon from "../assets/facebookicon.png";
import twitterIcon from "../assets/twittericon.png";

const LoginPage = () => {
  const [token] = useState(() => {
    try {
      const storedToken = localStorage.getItem("auth");
      if (!storedToken) return null;
      return JSON.parse(storedToken);
    } catch (error) {
      return null;
    }
  });
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLoginSubmit = async (e) => {
    const formData = {
      email: email,
      password: password,
    };

    e.preventDefault();
    if (formData.email.length > 0 && formData.password.length > 0) {
      try {
        // console.log(formData);
        const response = await axios.post("/api/v1/login", formData);
        if (response.data.msg === "Email not found"){
          toast.error("email not found");
        } else if (response.data.msg === "Invalid password") {
          toast.error("password incorrect");
        } else {
          console.log(response);
          localStorage.setItem("auth", JSON.stringify(response.data.token));
          toast.success("Login successfull");
          navigate("/dashboard");
        }
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      toast.error("Please fill all inputs");
    }
  };
  
  useEffect(() => {
    if (token !== null) {
      toast.success("You already logged in");
      navigate("/dashboard");
    }
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card p-4 shadow-sm"
        style={{
          width: "400px",
          minHeight: "554.19px",
          borderRadius: "12px",
        }}
      >
        <div className="text-center mb-4">
          {/* Logo */}
          <img
            src={logo}
            alt="Nasclub Logo"
            style={{ width: "60px", height: "60px" }}
          />
          <h5 className="mt-3 fw-bold">Welcome to Nasclub</h5>
          <small className="text-muted">Sign in to continue</small>
        </div>
        <div className="mb-3">
          <label htmlFor="username" className="form-label fw-semibold">
            email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            onChange={handleChangeEmail}
            value={email}
            placeholder="Enter email"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label fw-semibold">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            onChange={handleChangePassword}
            placeholder="Enter password"
            value={password}
          />
        </div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="rememberMe"
            />
            <label className="form-check-label" htmlFor="rememberMe">
              Remember me
            </label>
          </div>
          <Link to="/reset" className="text-decoration-none small text-primary">
            Forgot password?
          </Link>
        </div>
        <div className="d-grid mb-3">
          <button className="btn btn-primary" onClick={handleLoginSubmit}>
            Log In
          </button>
        </div>

        <div className="text-center mb-3">
          <small>
            Don't have an account?{" "}
            <Link to="/register" className="text-decoration-none text-primary">
              Register here
            </Link>
          </small>
        </div>
        <div className="text-center">
          <div className="d-flex align-items-center justify-content-center">
            <hr className="flex-grow-1" />
            <small className="mx-2 text-muted">Or Login With</small>
            <hr className="flex-grow-1" />
          </div>
          <div className="d-flex justify-content-center gap-3 mt-3">
            <button className="btn btn-outline-info rounded-circle px-3">
              <img src={googleIcom} width={20} alt="google" />
            </button>
            <button className="btn btn-outline-info rounded-circle px-3">
              <img src={twitterIcon} width={20} alt="google" />
            </button>
            <button className="btn btn-outline-danger rounded-circle px-3">
              <img src={facebookIcon} width={20} alt="google" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
