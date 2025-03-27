import React, { useState, useEffect } from "react";
import logo from "../assets/logo-sm.png";
// import GoogleSvg from "../assets/icons8-google.svg";
// import { FaEye } from "react-icons/fa6";
// import { FaEyeSlash } from "react-icons/fa6";
import "../styles/Register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "../API/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "./components/modal";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    agree: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();
  const [token, setToken] = useState(() => {
    try {
      const storedToken = localStorage.getItem("auth");
      if (!storedToken) return null;
      return JSON.parse(storedToken);
    } catch (error) {
      return null;
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8 && 
      /[A-Z]/.test(password) && 
      /[0-9]/.test(password);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Adjust according to your requirements
    return phoneRegex.test(phoneNumber);
  };

  const validateUsername = (username) => {
    return username.length >= 3; // Adjust the criteria as needed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let { username, email, password, confirmPassword, phoneNumber, agree } = formData;

    if (!username || !email || !password || !confirmPassword || !phoneNumber || !agree) {
      setModalMessage("Please fill in all fields");
      setShowModal(true);
      return;
    }

    if (!validateUsername(username)) {
      setModalMessage("Username must be at least 3 characters long.");
      setShowModal(true);
      return;
    }

    if (!validateEmail(email)) {
      setModalMessage("Please enter a valid email address.");
      setShowModal(true);
      return;
    }

    if (!validatePassword(password)) {
      setModalMessage("Password must be at least 8 characters long, contain at least one uppercase letter and one number.");
      setShowModal(true);
      return;
    }

    if (password !== confirmPassword) {
      setModalMessage("Passwords don't match");
      setShowModal(true);
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setModalMessage("Please enter a valid phone number.");
      setShowModal(true);
      return;
    }

    try {
      await axios.post("/api/v1/register", formData);
      setModalMessage("Registration successful");
      setShowModal(true);
      navigate("/login");
    } catch (err) {
      setModalMessage("Email already exists");
      setShowModal(true);
    }
  };

  useEffect(() => {
    if (token !== null) {
      setModalMessage("You already logged in");
      setShowModal(true);
      navigate("/dashboard");
    }
  }, [token, navigate]);

  return (
    <div className="container-md">
      <div className="row vh-100 d-flex justify-content-center">
        <div className="col-12 align-self-center">
          <div className="card-body p-0">
            <div className="row">
              <div className="col-lg-5 mx-auto">
                <div className="card">
                  <div className="card-body p-0">
                    <div className="text-center p-3">
                      <img src={logo} alt="Logo" style={{ width: "50px" }} />
                      <h3 className="mt-3 fw-semibold font-18">
                        Nasclub Investor
                      </h3>
                      <p className="text-muted">
                        Sign up to continue to Nasclub.
                      </p>
                    </div>
                  </div>
                  <hr className="hr-dashed" />
                  <div className="card-body pt-0">
                    <form onSubmit={handleSubmit} className="mb-4">
                      <div className="mb-2 form-group">
                        <label className="form-label">Username</label>
                        <input
                          type="text"
                          name="username"
                          className="form-control"
                          placeholder="Enter username"
                          value={formData.username}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="mb-2 form-group">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="mb-2 form-group">
                        <label className="form-label">Password</label>
                        <input
                          type="password"
                          name="password"
                          className="form-control"
                          placeholder="Enter password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="mb-2 form-group">
                        <label className="form-label">Confirm Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          className="form-control"
                          placeholder="Enter confirm password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="mb-2 form-group">
                        <label className="form-label">mobile number</label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          className="form-control"
                          placeholder="Enter phone number"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="form-check mb-2">
                        <input
                          type="checkbox"
                          name="agree"
                          className="form-check-input border-primary"
                          checked={formData.agree}
                          onChange={handleChange}
                        />
                        <label className="form-check-label text-muted">
                          By registering you agree to the Metrica {" "}
                          <Link to="#" className="text-primary">
                            Terms of Use
                          </Link>
                        </label>
                      </div>

                      <button type="submit" className="btn btn-primary w-100">
                        Register
                      </button>
                    </form>

                    <p className="text-center mt-3">
                      Already have an account?{" "}
                      <Link to="/login" className="text-primary">
                        Log in
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        message={modalMessage} 
      />
    </div>
  );
};

export default RegisterForm;
