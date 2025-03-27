import React, { useEffect, useState } from "react";
import axios from "../../API/axios";
import { jwtDecode } from "jwt-decode";

const FundBoard = () => {
  const [currentAddpage, setAddpage] = useState(1);
  const [currentWithdrawpage, setWithdrawpage] = useState(1);
  const [fund, setFund] = useState(false);
  const [amount, setAmount] = useState(0);
  const [withdraw, setwithdraw] = useState(false);
  const url = "/api/v1/getFund_history";
  const [transaction, setTransaction] = useState([]);
  const [totalFund, setTotalFund] = useState(0);
  const [decoded, setDecoded] = useState();

  // Fix token initialization
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("auth");
    return storedToken ? JSON.parse(storedToken) : null;
  });
  
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log(decodedToken,"DECODE**********")
        setDecoded(decodedToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (error) {
        console.error("Error decoding token:", error);
        // Handle invalid token - you might want to redirect to login
        localStorage.removeItem("auth");
        setToken(null);
        setDecoded(null);
      }
    }
  }, [token]);

  const calculateTotalFund = (transactions) => {
    let total = 0;
    transactions.forEach(trans => {
      if (trans.Format === "fund") {
        total += parseFloat(trans.amount);
      } else if (trans.Format === "withdraw") {
        total -= parseFloat(trans.amount);
      }
    });
    return total;
  };

  const fetchData = async () => {
    if (!token || !decoded) return;

    try {
      const response = await axios.get(url);
      const sortedData = response.data.fund.sort((a, b) => {
        const dateA = new Date(`${a.Date}T${a.Time}`);
        const dateB = new Date(`${b.Date}T${b.Time}`);
        return dateB - dateA;
      });
      setTransaction([...sortedData]);
      setTotalFund(calculateTotalFund(sortedData));
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 401) {
        // Handle unauthorized - you might want to redirect to login
        localStorage.removeItem("auth");
        setToken(null);
        setDecoded(null);
      }
    }
  };

  useEffect(() => {
    if (token && decoded) {
      fetchData();
      const interval = setInterval(fetchData, 300);
      return () => clearInterval(interval);
    }
  }, [token, decoded]);

  const sendWithdrawMessage = async () => {
    if (!token || !decoded) return;

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (parseFloat(amount) > totalFund) {
      alert("Insufficient funds");
      return;
    }

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;
    const formattedTime = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

    const withdraw_fund = {
      sender: decoded.email,
      Format: "withdraw",
      Date: formattedDate,
      Time: formattedTime,
      Transaction_id: "c12b001a15f9bd46ef1c6551386c6a2bcda1ab3eae5091fba",
      Type: "pending",
      amount: parseFloat(amount),
    };

    try {
      const response = await axios.post(url, withdraw_fund);
      setTransaction([...response.data.fund]);
      setTotalFund(calculateTotalFund(response.data.fund));
      setwithdraw(false);
      setAmount(0);
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      alert("Failed to withdraw funds. Please try again.");
    }
  };

  const sendMessage = async () => {
    if (!token || !decoded) return;

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;
    const formattedTime = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

    const post_fund = {
      sender: decoded.email,
      Format: "fund",
      Date: formattedDate,
      Time: formattedTime,
      Transaction_id: "c12b001a15f9bd46ef1c6551386c6a2bcda1ab3eae5091fba",
      Type: "pending",
      amount: parseFloat(amount),
    };

    try {
      const response = await axios.post(url, post_fund);
      setTransaction([...response.data.fund]);
      setTotalFund(calculateTotalFund(response.data.fund));
      setFund(false);
      setAmount(0);
    } catch (error) {
      console.error("Error adding funds:", error);
      alert("Failed to add funds. Please try again.");
    }
  };

  const totalAddPages = Math.ceil(
    transaction.filter((items) => items.Format === "fund").length / 10
  );
  const totalWithdrawPages = Math.ceil(
    transaction.filter((items) => items.Format === "withdraw").length / 10
  );

  return (
    <>
   {!decoded || <div className="container mt-4">
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="bg-light text-center p-3 d-flex justify-content-between align-items-center rounded mb-3 border">
                <div className="text-start">
                  <h5 className="font-18 m-0 text-primary">
                    ${totalFund.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h5>
                  <p className="mb-0 fw-semibold text-muted">Total Funds</p>
                </div>
                <div>
                  <button
                    type="button"
                    className="btn btn-sm btn-success me-2"
                    onClick={() => setFund(true)}
                  >
                    Add Funds
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => setwithdraw(true)}
                  >
                    Withdraw Funds
                  </button>
                </div>
              </div>
              <div className="border rounded p-3">
                <h5 className="m-0 font-15 mb-3">
                  <img
                    src="https://www.vectorlogo.zone/logos/bankofamerica/bankofamerica-ar21.svg"
                    alt="US Bank"
                    height="50"
                    className="me-2"
                  />
                </h5>
                <div className="row">
                  <div className="col-4">
                    <h6 className="m-0 text-muted">Account Number</h6>
                    <p className="mb-0">{decoded.bank}</p>
                  </div>
                  <div className="col-4">
                    <h6 className="m-0 text-muted">IFSC Code</h6>
                    <p className="mb-0">COLI000521</p>
                  </div>
                  <div className="col-4">
                    <h6 className="m-0 text-muted">Branch</h6>
                    <p className="mb-0">{decoded.branch} {decoded.country}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="text-center mb-3">
                <span className="h5 text-primary">$58,451.25</span>
                <h6 className="text-uppercase font-11 text-muted mt-2 m-0">
                  Amount Invested
                </h6>
              </div>
              <hr className="hr-dashed" />
              <ul className="list-group list-group-flush mb-3">
                <li className="list-group-item d-flex justify-content-between">
                  Opening Balance <span className="fw-semibold" style={{ color: 'gold' }}>$5521.50</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  Funds used <span className="fw-semibold" style={{ color: 'gray' }}>$2100.00</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <div className="row align-items-center">
            <div className="col">
              <h4 className="card-title m-0">Transaction History</h4>
            </div>
            <div className="col-auto">
              <ul className="nav nav-tabs tab-nagative-m" role="tablist">
                <li className="nav-item">
                  <a
                    className="nav-link active btn-danger"
                    data-bs-toggle="tab"
                    href="#Added"
                    role="tab"
                    aria-selected="true"
                    style={{ backgroundColor: 'info', color: 'gray' }}
                  >
                    Added
                  </a>
                </li>
                <li className="nav-item btn-danger">
                  <a
                    className="nav-link"
                    data-bs-toggle="tab"
                    href="#Withdrown"
                    role="tab"
                    aria-selected="false"
                    style={{ backgroundColor: 'info', color: 'gray' }}
                  >
                    Withdrawn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="tab-content" id="Amount_history">
            <div
              className="tab-pane show active"
              id="Added"
              role="tabpanel"
              aria-labelledby="Added-tab"
            >
              <div className="table-responsive dash-social">
                <table className="table table-bordered table-hover">
                  <thead className="thead-light">
                    <tr>
                      <th>No</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Transaction ID</th>
                      <th>Type</th>
                      <th>Amount</th>
                    </tr>
                  </thead>

                  <tbody>
                    {transaction
                      .filter((items) => items.Format === "fund")
                      .map((item, index) => {
                        if (index > 10 * currentAddpage - 11)
                          if (index < 10 * currentAddpage)
                            return (
                              <tr>
                                <td>{index + 1}</td>
                                <td>{item.Date}</td>
                                <td>{item.Time}</td>
                                <td>{item.Transaction_id}</td>
                                <td>
                                  <span className ={(item.Type==="success")?"text-success":(item.Type === "pending"?"text-warning":"text-danger")}>
                                    {item.Type}
                                  </span>
                                </td>
                                <td>${item.amount}</td>
                              </tr>
                            );
                      })}
                  </tbody>
                </table>
              </div>
              <nav aria-label="..." className="float-end">
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${currentAddpage === 1 ? "disabled" : ""}`}>
                    <a
                      className="page-link"
                      onClick={() => {
                        if (currentAddpage > 1) setAddpage((item) => item - 1);
                      }}
                    >
                      Previous
                    </a>
                  </li>
                  {[...Array(totalAddPages)].map((_, index) => (
                    <li
                      key={index}
                      className={`page-item ${
                        currentAddpage === index + 1 ? "active" : ""
                      }`}
                    >
                      <a
                        className="page-link"
                        onClick={() => setAddpage(index + 1)}
                      >
                        {index + 1}
                      </a>
                    </li>
                  ))}
                  <li
                    className={`page-item ${
                      currentAddpage === totalAddPages ? "disabled" : ""
                    }`}
                  >
                    <a
                      className="page-link"
                      onClick={() => {
                        if (currentAddpage < totalAddPages) setAddpage((item) => item + 1);
                      }}
                    >
                      Next
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            <div
              className="tab-pane "
              id="Withdrown"
              role="tabpanel"
              aria-labelledby="Withdrown-tab"
            >
              <div className="table-responsive dash-social">
                <table className="table table-bordered table-hover">
                  <thead className="thead-light">
                    <tr>
                      <th>No</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Transaction ID</th>
                      <th>Type</th>
                      <th>Amount</th>
                    </tr>
                  </thead>

                  <tbody>
                    {transaction
                      .filter((items) => items.Format === "withdraw")
                      .map((item, index) => {
                        if (index > 10 * currentWithdrawpage - 11)
                          if (index < 10 * currentWithdrawpage)
                            return (
                              <tr>
                                <td>{index + 1}</td>
                                <td>{item.Date}</td>
                                <td>{item.Time}</td>
                                <td>{item.Transaction_id}</td>
                                <td>
                                  <span className ={(item.Type==="success")?"text-success":(item.Type === "pending"?"text-warning":"text-danger")}>
                                    {item.Type}
                                  </span>
                                </td>
                                <td>${item.amount}</td>
                              </tr>
                            );
                      })}
                  </tbody>
                </table>
              </div>
              <nav aria-label="..." className="float-end">
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${currentWithdrawpage === 1 ? "disabled" : ""}`}>
                    <a
                      className="page-link"
                      onClick={() => {
                        if (currentWithdrawpage > 1) {
                          setWithdrawpage((item) => {
                            return item - 1;
                          });
                        }
                      }}
                    >
                      Previous
                    </a>
                  </li>
                  {[...Array(totalWithdrawPages)].map((_, index) => (
                    <li
                      key={index}
                      className={`page-item ${
                        currentWithdrawpage === index + 1 ? "active" : ""
                      }`}
                    >
                      <a
                        className="page-link"
                        onClick={() => setWithdrawpage(index + 1)}
                      >
                        {index + 1}
                      </a>
                    </li>
                  ))}
                  <li
                    className={`page-item ${
                      currentWithdrawpage === totalWithdrawPages ? "disabled" : ""
                    }`}
                  >
                    <a
                      className="page-link"
                      onClick={() => {
                        if (currentWithdrawpage < totalWithdrawPages) setWithdrawpage((item) => item + 1);
                      }}
                    >
                      Next
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {fund && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content p-4">
              <div className="card p-4 shadow-sm" style={{ width: "450px" }}>
                <h2 className="text-center mb-4">Enter Amount</h2>
                <div className="mb-3">
                  <button className="btn btn-outline-primary me-2">
                    Current: ${totalFund.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </button>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter amount"
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <button
                  className="btn btn-success w-100"
                  onClick={() => {
                    sendMessage();
                    setFund(false);
                  }}
                >
                  Add Funds
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {withdraw && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content p-4">
              <div className="card p-4 shadow-sm" style={{ width: "450px" }}>
                <h2 className="text-center mb-4">Enter Amount</h2>
                <div className="mb-3">
                  <button className="btn btn-outline-primary me-2">
                    Current: ${totalFund.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </button>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter amount"
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <button
                  className="btn btn-danger w-100"
                  onClick={(e) => {
                    sendWithdrawMessage(e);
                  }}
                >
                  Withdraw Funds
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>}
    </>
  );
};

export default FundBoard;
