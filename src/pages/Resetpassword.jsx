import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/logo-sm.png";
import { Link } from "react-router-dom";
const ResetPassword = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card p-4 shadow-sm"
        style={{
          width: "22%",
          minHeight: "330px",
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
          <h5 className="mt-3 fw-bold">Let's Get Started Nasclub</h5>
          <small className="text-muted">Sign in to continue to Nasclub.</small>
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label fw-semibold">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Email"
          />
        </div>
        <div className="d-grid mb-3">
          <button className="btn btn-primary">Reset</button>
        </div>
        <div className="text-center">
          <small>
            Remember it? <Link to="/register">Sign in here</Link>
          </small>
        </div>
      </div>
    </div>
  );
};
export default ResetPassword;
