import React, { useState, useEffect } from "react";
import Money from "../../assets/money.png";
import { jwtDecode } from "jwt-decode";
import axios from "../../API/axios";

const AdminFund = () => {
  const [token] = useState(JSON.parse(localStorage.getItem("auth")) || "");
  const decoded = jwtDecode(token);
  const isAdmin = decoded.role === "admin";
  const [showDialog, setShowDialog] = useState(false);
  const [amount, setAmount] = useState("");
  const [totalFund, setTotalFund] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchTotalFund();
  }, []);

  const fetchTotalFund = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get("/api/v1/getTotal_fund");
      if (response.data.total_fund.length > 0) {
        setTotalFund(parseFloat(response.data.total_fund[0].value));
      }
    } catch (error) {
      setError("Failed to fetch current balance");
      console.error("Error fetching total fund:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFund = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    if (parseFloat(amount) > 1000000) {
      setError("Amount cannot exceed $1,000,000");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

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
        sender: decoded.email,
        Format: "fund",
        Date: formattedDate,
        Time: formattedTime,
        Transaction_id: "c12b001a15f9bd46ef1c6551386c6a2bcda1ab3eae5091fba",
        Type: "pending",
        amount: parseFloat(amount),
      };

      await axios.post("/api/v1/getFund_history", post_fund);

      // Update total fund
      const newTotal = isAdmin ? parseFloat(amount) : totalFund + parseFloat(amount);
      await axios.post("/api/v1/getTotal_fund", [
        {
          name: "total",
          value: newTotal.toString(),
        },
      ]);

      setTotalFund(newTotal);
      setAmount("");
      setSuccess(isAdmin ? "Total fund updated successfully!" : "Funds added successfully!");
      setTimeout(() => {
        setShowDialog(false);
      }, 1500);
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
          <p className="border-bottom pb-1 mb-2 font-14 text-muted">
            Fund Available
          </p>
          {isLoading ? (
            <div className="spinner-border spinner-border-sm text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            <h3 className="my-1 font-20 fw-bold text-primary">
              ${totalFund.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
            "Edit Total Fund"
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
                  <p className="text-muted">
                    Current Balance: ${totalFund.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
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