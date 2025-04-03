import React, { useState, useEffect } from "react";
import { Navbar, Nav} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { toast} from "react-toastify";
import { ThemeToggle } from '../components/ThemeToggle';
import { jwtDecode } from "jwt-decode"; // Use named import
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "react-toastify/dist/ReactToastify.css";
import "../../App.css";
import axios from "../../API/axios";
import { useTheme } from '../../context/ThemeContext';
import logo from "../../assets/logo-sm.png";
import {
  FaHome,
  FaChartLine,
  FaBriefcase,
  FaBalanceScale,
  FaShoppingCart,
  FaWallet,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaUsers,
} from "react-icons/fa";

const TopNavbar = () => {
  const [notification, setNotification] = useState(false);
  const [flagItem, setFlagItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [pending, setPending] = useState([]); // Define 'pending'
  const location = useLocation();
  const pathname = location.pathname; // This line was missing proper initialization
  const navigate = useNavigate(); // Move outside conditional block
  const { isDarkMode } = useTheme();
  const [token] = useState(() => {
    try {
      const storedAuth = localStorage.getItem("auth");
      if (!storedAuth) return null;
      return JSON.parse(storedAuth);
    } catch (error) {
      return null;
    }
  });

  // Set axios auth header when token is available
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      toast.warn("Please login first to access the dashboard", { autoClose: 300 });
    }
  }, [token, navigate]); // Add 'navigate' to dependencies

  useEffect(() => {
    const fetchPending = async () => {
      try {
        if (!token) return; // Don't fetch if no token
        const response = await axios.get("/api/v1/getpending");
        setPending(response.data.fund || []);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("auth");
          navigate("/login");
          toast.error("Session expired. Please login again.", { autoClose: 300 });
        } else {
          toast.error("Failed to fetch notifications", { autoClose: 300 });
        }
      }
    };

    fetchPending();
    const interval = setInterval(fetchPending, 500); // Fetch data every 10 seconds
    return () => clearInterval(interval);
  }, [token, navigate]); // Ensure this hook is not conditionally called

  const acceptPermission = async () => {
    try {
      const updatedItem = { ...selectedItem, Type: "success" };
      await axios.put("/api/v1/getpending", updatedItem);
      setPending((prev) => prev.filter((item) => item.id !== selectedItem.id)); // Update pending state
      setFlagItem(false);
      toast.success("Permission accepted successfully", { autoClose: 300 });
    } catch (error) {
      toast.error("Failed to accept permission", { autoClose: 300 });
    }
  };

  const denyPermission = async () => {
    try {
      const updatedItem = { ...selectedItem, Type: "failed" };
      await axios.put("/api/v1/getpending", updatedItem);
      setPending((prev) => prev.filter((item) => item.id !== selectedItem.id)); // Update pending state
      setFlagItem(false);
      toast.success("Permission denied successfully", { autoClose: 300 });
    } catch (error) {
      toast.error("Failed to deny permission", { autoClose: 300 });
    }
  };

  const logout = () => {
    axios.post("/api/v1/logout", { id: jwtDecode(token).id }); // Use named import here
    localStorage.removeItem("auth");
    navigate("/login");
  };

  if (!token) {
    return null; // Prevent rendering if token is invalid
  }

  const decoded = jwtDecode(token); // Use named import here

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm px-4 py-2" isDarkMode={isDarkMode}>
      {/* Modal for Permission */}
      {flagItem && (
        <div className="modal" style={{ display: "block" }} tabIndex="1">
          <div className="modal-dialog">
            <div className="modal-content p-4">
              <div className="card p-4" style={{ width: "450px" }}>
                <h2 className="text-center">Permission</h2>
                <div className="mb-3">
                  <button className="btn btn-outline-primary me-2">From</button>
                  <input
                    type="text"
                    className="btn btn-outline-primary me-2"
                    value={selectedItem.sender}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <button className="btn btn-outline-primary me-2">Amount</button>
                  <input
                    type="text"
                    className="btn btn-outline-primary me-2"
                    value={`$${selectedItem.amount}`}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <button className="btn btn-outline-primary me-2">Format</button>
                  <input
                    type="text"
                    className="btn btn-outline-primary me-2"
                    value={selectedItem.Format}
                    readOnly
                  />
                </div>
                <div className="d-flex">
                  <button className="btn btn-success w-100 me-2" onClick={acceptPermission}>
                    Accept
                  </button>
                  <button className="btn btn-danger w-100" onClick={denyPermission}>
                    Deny
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navbar Brand */}
      <Navbar.Brand>
        <img src={logo} width={30} alt="Logo" />
        <strong className="ms-2">Nasclub</strong>
      </Navbar.Brand>

      {/* Navigation Links */}
      <Nav className="me-auto">
        <Nav.Link onClick={() => navigate("/dashboard")} className="d-flex align-items-center">
          <FaHome />
          <span className={`ms-2 ${pathname === "/dashboard" ? "text-primary" : ""}`}>
            Dashboard
          </span>
        </Nav.Link>
        <Nav.Link className="d-flex align-items-center">
          <FaChartLine />
          <span className="ms-2">Market</span>
        </Nav.Link>
        <Nav.Link onClick={() => navigate("/portfolio")} className="d-flex align-items-center">
          <FaBriefcase />
          <span className={`ms-2 ${pathname === "/portfolio" ? "text-primary" : ""}`}>
            Portfolio
          </span>
        </Nav.Link>
        <Nav.Link className="d-flex align-items-center">
          <FaBalanceScale />
          <span className="ms-2">Position</span>
        </Nav.Link>
        <Nav.Link onClick={() => navigate("/order")} className="d-flex align-items-center">
          <FaShoppingCart />
          <span className={`ms-2 ${pathname === "/order" ? "text-primary" : ""}`}>
            Orders
          </span>
        </Nav.Link>
        <Nav.Link onClick={() => navigate("/fund")} className="d-flex align-items-center">
          <FaWallet />
          <span className={`ms-2 ${pathname === "/fund" ? "text-primary" : ""}`}>
            Funds
          </span>
        </Nav.Link>
      </Nav>

      {/* Right Side Icons */}
      <Nav>
        {/* Notifications */}
        {decoded.role === "admin" && (
          <Nav.Link>
            <div className="position-relative">
              <FaBell
                className="position-relative"
                onClick={() => setNotification(!notification)}
              />
              {pending.length > 0 && (
                <span
                  className="badge bg-danger position-absolute"
                  style={{
                    top: "-5px",
                    right: "-10px",
                    fontSize: "10px",
                    borderRadius: "50%",
                    padding: "3px 6px",
                  }}
                >
                  {pending.length}
                </span>
              )}
            </div>
            {notification && (
              <div
                className="position-absolute border rounded shadow bg-light"
                style={{
                  top: "40px",
                  right: "10px",
                  width: "350px",
                  zIndex: 1000,
                }}
              >
                <div className="p-3 border-bottom">
                  <strong>Notifications</strong>
                  <span className="float-end">{pending.length}</span>
                </div>
                <div className="p-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {pending.map((item, index) => (
                    <div
                      key={index}
                      className="d-flex justify-content-between align-items-center py-2"
                      onClick={() => {
                        setSelectedItem(item);
                        setFlagItem(true);                       
                      }}
                    >
                      <span>{item.sender}</span>
                      <span className="text-muted">${item.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Nav.Link>
        )}

        {/* User Dropdown */}
        <Nav.Link>
          <div className="dropdown">
            <button
              className="btn dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src={decoded.avatar}
                width="30"
                height="30"
                className="rounded-circle"
                alt="User Avatar"
              />
            </button>
            <ul className="dropdown-menu">
              <li>
                <span className="dropdown-item" onClick={() => navigate("/profile")}>
                  <FaUserCircle className="me-2" />
                  Profile
                </span>
              </li>
              <li>
                <span className="dropdown-item" onClick={logout}>
                  <FaSignOutAlt className="me-2" />
                  Log Out
                </span>
              </li>
              {decoded.role === "admin" && (
                <li>
                  <span className="dropdown-item" onClick={() => navigate("/users")}>
                    <FaUsers className="me-2" />
                    User Info
                  </span>
                </li>
              )}
            </ul>
          </div>
        </Nav.Link>
        <Navbar isDarkMode={isDarkMode}>
          <div className="nav-controls">
            <ThemeToggle />
          </div>
        </Navbar>
      </Nav>
    </Navbar>
  );
};

export default TopNavbar;
