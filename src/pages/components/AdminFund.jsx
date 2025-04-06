import React, { useState, useEffect } from "react";
import Money from "../../assets/money.png";
import { jwtDecode } from "jwt-decode";
import axios from "../../API/axios";

const AdminFund = () => {
  const [token] = useState(JSON.parse(localStorage.getItem("auth")) || "");
  const decoded = jwtDecode(token);
  const isAdmin = decoded.role === "admin";
  const [showDialog, setShowDialog] = useState(false);
  const [amount, setAmount] = useState("0");
  const [totalFund, setTotalFund] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [balance, setBalance] = useState(decoded.balance);

  useEffect(() => {
    // Create WebSocket connection
    const ws = new WebSocket('your_websocket_endpoint');
  
    ws.onopen = () => {
      console.log('Connected to WebSocket');
    };
  
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.name === "trew") {
        setBalance(data.balance);
      }
    };
  
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  
    // Cleanup WebSocket connection on component unmount
    return () => {
      ws.close();
    };
  }, []);
    // Set up polling every 5 seconds
    // const interval = setInterval(fetchBalance, 5000);

  // const fetchBalance = async () => {
  //   setIsLoading(true);
  //   setError("");
  //   try {


  //   } catch (error) {
  //     setError("Failed to fetch current balance");
  //     console.error("Error fetching total fund:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleAddFund = async () => {
    if (decoded.bank === "Unlinked") {
      setError("Please link your bank account to add funds.");
      return;
    }
    if (!amount || isNaN(amount) || parseFloat(amount) < 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");
    setBalance(balance);
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${now.getFullYear()}`;
    const formattedTime = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

    try {
      // Create new fund entry
      const post_fund = {
        sender: decoded.name,
        Format: "fund",
        Date: formattedDate,
        Time: formattedTime,
        Transaction_id:decoded.bank,
        Type: "pending",
        amount: parseFloat(amount),
      };
      
      await axios.post("/api/v1/getFund_history", post_fund);
      
      setSuccess(isAdmin ? "Total fund updated successfully!" : "Funds added successfully!");
      setTimeout(() => {
        setShowDialog(false);
      }, 500);
    } catch (error) {
      setError("Failed to process request. Please try again.");
      console.error("Error processing fund:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setAmount("");
    setError("");
    setSuccess("");
  };

  return (
    <div className="card p-4" style={{ height: "200px" }}>
      <div className="row d-flex justify-content-between align-items-center">
        {/* Fund Information */}
        <div className="col">
          <p className="border-bottom pb-1 mb-2 font-14" style={{ color: "green" }}>
            Fund Available
          </p>
          {isLoading ? (
            <div className="spinner-border spinner-border-sm text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            <h3 className="my-1 font-20 fw-bold text-primary">
              {/* ${totalFund.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} */}
              ${balance}
            </h3>
          )}
        </div>

        {/* Money Icon */}
        <div className="col-auto">
          <img src={Money} className="thumb-lg" alt="money" width={80} />
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center mt-4">
        <button 
          className={`btn ${isAdmin ? 'btn-warning' : 'btn-primary'} w-75`}
          onClick={() => setShowDialog(true)}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Processing...
            </>
          ) : isAdmin ? (
            "Initialize Funds"
          ) : (
            "Add Funds"
          )}
        </button>
      </div>

      {/* Dialog */}
      {showDialog && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content p-4">
              <div className="card p-4 shadow-sm" style={{ width: "450px" }}>
                <h2 className="text-center mb-4">
                  {isAdmin ? "Edit Total Fund" : "Add Funds"}
                </h2>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="alert alert-success" role="alert">
                    {success}
                  </div>
                )}
                <div className="mb-3">
                  {/* <p className="text-muted">
                    Current Balance: ${totalFund.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p> */}
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      className="form-control"
                      placeholder={isAdmin ? "Enter new total amount" : "Enter amount to add"}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="0"
                      step="0.01"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-secondary flex-grow-1"
                    onClick={handleCloseDialog}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    className={`btn ${isAdmin ? 'btn-warning' : 'btn-primary'} flex-grow-1`}
                    onClick={handleAddFund}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {isAdmin ? "Updating..." : "Adding..."}
                      </>
                    ) : isAdmin ? (
                      "Update Total"
                    ) : (
                      "Add Funds"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFund;