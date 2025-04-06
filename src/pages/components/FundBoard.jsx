import React, { useEffect, useState } from "react";
import axios from "../../API/axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const FundBoard = () => {
  const [currentAddpage, setAddpage] = useState(1);
  const [currentWithdrawpage, setWithdrawpage] = useState(1);
  const [fund, setFund] = useState(false);
  const [amount, setAmount] = useState("");
  const [withdraw, setwithdraw] = useState(false);
  const url = "/api/v1/getFund_history";
  const [transaction, setTransaction] = useState([]);
  const [totalFund, setTotalFund] = useState(0);
  const [depoFund, setDepoFund] = useState(0);
  const [withFund, setWithFund] = useState(0);
  const [decoded, setDecoded] = useState();
  const [showDelModal, setShowDelModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    sender: "",
    Format: "",
    Transaction_id: "",
    amount: "",
    Type: "",
  });
  // Fix token initialization
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("auth");
    return storedToken ? JSON.parse(storedToken) : null;
  });

  const handleEdit = async(e) => {
    e.preventDefault();
    try {
      console.log("****************",editFormData);
      await axios.put(`/api/v1/getFund_history/${editItem._id}`, editFormData);
      setShowDelModal(false);
      setEditItem(null);
      fetchData();
      toast.success("Transaction updated successfully!");
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleEditInputChange = (e) => {
    const {name, value} = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        //console.log(decodedToken,"DECODE**********");
        setDecoded(decodedToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("auth");
        setToken(null);
        setDecoded(null);
      }
    }
  }, [token]);

  const calculateTotalFund = (transactions) => {
    let total = 0;
    transactions.forEach(trans => {
      if (trans.Format === "fund" && trans.Type === "success" && trans.sender === decoded.name) {
        total += parseFloat(trans.amount);
      } else if (trans.Format === "withdraw" && trans.Type === "success" && trans.sender === decoded.name) {
        total -= parseFloat(trans.amount);
      }
    });
    decoded.balance = total;
    axios.put(`/api/v1/UpdateUser/${decoded.id}`, { ...decoded, });
    return total;
  };

  const calculateDepositFund = (transactions) => {
    let depoFund = 0;
    transactions.forEach(trans => {
      if (trans.Format === "fund" && trans.Type === "success" && trans.sender === decoded.name) 
        depoFund += parseFloat(trans.amount);
    });
    return depoFund;
  };

  const calculateWithdrawFund = (transactions) => {
    let withFund = 0;
    transactions.forEach(trans => {
      if (trans.Format === "withdraw" && trans.Type === "success" && trans.sender === decoded.name) 
        withFund += parseFloat(trans.amount);
    });
    return withFund;
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
      setDepoFund(calculateDepositFund(sortedData));
      setWithFund(calculateWithdrawFund(sortedData));
      setTotalFund(calculateTotalFund(sortedData));
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("auth");
        setToken(null);
        setDecoded(null);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/v1/getFund_history/${id}`);
      console.log(fund,"array")
      // setFund(fund.filter(item => item._id !== id));
      setShowDelModal(false);
      toast.success("Deleted successfully");
      setItemToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete");
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
    if (!token || !decoded) {
      alert("Please login first");
      return;
    }

    try {
      const amountNum = parseFloat(amount);
      if (!amount || isNaN(amountNum) || amountNum <= 0) {
        alert("Please enter a valid amount");
        return;
      }

      if (amountNum > totalFund) {
        alert(`Insufficient funds. Your current balance is $${totalFund}`);
        return;
      }

      const now = new Date();
      const formattedDate = `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()}`;
      const formattedTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

      const withdraw_fund = {
        Format: "withdraw",
        Date: formattedDate,
        Time: formattedTime,
        Transaction_id: decoded.bank,
        Name: decoded.name,
        Type: "pending",
        amount: amountNum,
      };

      const response = await axios.post(url, withdraw_fund);
      setTransaction([...response.data.fund]);
      setWithFund(calculateWithdrawFund(response.data.fund));
      setTotalFund(calculateTotalFund(response.data.fund));
      setwithdraw(false);
      setAmount("");
      alert("Withdrawal request submitted successfully!");
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      alert(error.response?.data?.message || "Failed to withdraw funds. Please try again.");
    }
  };

  const sendMessage = async () => {
    if (!token || !decoded) {
      alert("Please login first");
      return;
    }

    try {
      const amountNum = parseFloat(amount);
      if (!amount || isNaN(amountNum) || amountNum <= 0) {
        alert("Please enter a valid amount");
        return;
      }

      const now = new Date();
      const formattedDate = `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()}`;
      const formattedTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

      const post_fund = {
        Format: "fund",
        Date: formattedDate,
        Time: formattedTime,
        Name: decoded.name,
        Transaction_id: decoded.bank,
        Type: "pending",
        amount: amountNum,
      };

      const response = await axios.post(url, post_fund);
      setTransaction([...response.data.fund]);
      setDepoFund(calculateDepositFund(response.data.fund));
      setTotalFund(calculateTotalFund(response.data.fund));
      setFund(false);
      setAmount("");
      alert("Funds added successfully!");
    } catch (error) {
      console.error("Error adding funds:", error);
      alert(error.response?.data?.message || "Failed to add funds. Please try again.");
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
                      $ {totalFund.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h5>
                    <p className="mb-0 fw-semibold text-muted">Your Balance</p>
                  </div>                  
                  {(decoded.bank === "Unlinked") ?
                    (<div>                    
                      <button
                        disabled = {true} 
                        className="btn btn-sm btn-secondary me-2"
                        //onClick={() => setFund(true)}
                      >
                        Deposit Funds
                      </button>
                      <button
                        disabled = {true}
                        className="btn btn-sm btn-sseconday"
                        //onClick={() => setwithdraw(true)}
                      >
                        Withdraw Funds
                      </button>
                    </div>)
                  :(<div>                    
                      <button
                        type="button" 
                        className="btn btn-sm btn-success me-2"
                        onClick={() => setFund(true)}
                      >
                        Deposit Funds
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => setwithdraw(true)}
                      >
                        Withdraw Funds
                      </button>
                    </div>)}
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
                  <div className="row" style={{ color: "green"}}>
                    <div className="col-4">
                      <h6 className="m-0" style={{ color: "gold"}}>Account Number</h6>
                      <p className="mb-0">{decoded.bank}</p>
                    </div>
                    <div className="col-4">
                      <h6 className="m-0" style={{ color: "gold"}}>IFSC Code</h6>
                      <p className="mb-0">{decoded.IFSC_Code}</p>
                    </div>
                    <div className="col-4">
                      <h6 className="m-0" style={{ color: "gold"}}>Branch</h6>
                      <p className="mb-0">{decoded.branch} {decoded.country}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="text-center mb-3">
                  <span className="h5 text-primary">Hi! {decoded.name}</span>
                  <h6 className="text-uppercase font-11 mt-2 m-0" style={{ color: "blue"}}>
                    Welcome to our Bank!
                  </h6>
                </div>
                <hr className="hr-dashed" />
                <ul className="list-group list-group-flush mb-3">
                  <li className="list-group-item d-flex justify-content-between">
                    Deposite <span className="fw-semibold text-success">$ {depoFund.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    Withdraw <span className="fw-semibold" style={{ color: 'gray' }}>$ {withFund.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Rest of your existing JSX code remains the same until the modals */}
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
                    className="nav-link active btn-danger text-info"
                    data-bs-toggle="tab"
                    href="#Added"
                    role="tab"
                    aria-selected="true"
                    style={{ backgroundColor: 'info', color: 'gray' }}
                  >
                    Deposit
                  </a>
                </li>
                <li className="nav-item btn-danger">
                  <a
                    className="nav-link text-info"
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
                  <thead className="thead-light text-center">
                    <tr className="text-center">
                      <th>No</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Transaction ID</th>
                      <th>Client</th>
                      <th>Type</th>
                      <th>Amount</th>
                      {decoded.role === "admin" && (
                        <th>Actions</th>
                      )}
                    </tr>
                  </thead>

                  <tbody class name="table-group-divider text-center" style={{ color: "blue" }}>
                    {transaction
                      .filter((items) => items.Format === "fund")
                      .map((item, index) => {
                        if (index > 10 * currentAddpage - 11)
                          if (index < 10 * currentAddpage)
                            return (
                              <tr className="text-center">
                                <td>{index + 1}</td>
                                <td>{item.Date}</td>
                                <td>{item.Time}</td>
                                <td>{item.Transaction_id}</td>
                                <td>{item.sender}</td>
                                <td>
                                  {item.Type === "donation" ? (<h6 className="bold" style={{color:"gold"}}>donation</h6>
                                    
                                  ):<span className ={(item.Type==="success")?"text-success":(item.Type === "pending"?"text-primary":"text-danger")}>
                                  {item.Type}
                                </span>}
                                  
                                </td>
                                <td>${item.amount}</td>
                                {decoded.role === "admin" && (
                                  <td>
                                    <button
                                      className="btn btn-sm btn-primary me-2"
                                      onClick={() => {
                                        setEditItem(item);
                                        setEditFormData({
                                          sender: item.sender,
                                          Format: item.Format,
                                          Transaction_id: item.Transaction_id,
                                          Type: item.Type,
                                          amount: item.amount
                                        });
                                        setShowModal(true);
                                      }}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      className="btn btn-sm btn-danger"
                                      onClick={() => {
                                        setItemToDelete(item._id);
                                        setShowDelModal(true);
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </td>
                                )}
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
                    <tr className="text-center">
                      <th>No</th>
                      <th>Date</th>
                      <th>Time</th>                   
                      <th>Transaction ID</th>
                      <th>Client</th>
                      <th>Type</th>
                      <th>Amount</th>
                      {decoded.role === "admin" && (
                        <th>Actions</th>
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {transaction
                      .filter((items) => items.Format === "withdraw")
                      .map((item, index) => {
                        if (index > 10 * currentWithdrawpage - 11)
                          if (index < 10 * currentWithdrawpage)
                            return (
                              <tr className="text-center">
                                <td>{index + 1}</td>
                                <td>{item.Date}</td>
                                <td>{item.Time}</td>                               
                                <td>{item.Transaction_id}</td>
                                <td>{item.sender}</td>
                                <td>
                                  <span className ={(item.Type==="success")?"text-success":(item.Type === "pending"?"text-primary":"text-danger")}>
                                    {item.Type}
                                  </span>
                                </td>
                                <td>${item.amount}</td>
                                {decoded.role === "admin" && (
                                  <td>
                                  <button
                                      className="btn btn-sm btn-primary me-2"
                                      onClick={() => {
                                        setEditItem(item);
                                        setEditFormData({
                                          sender: item.sender,
                                          Format: item.Format,
                                          Transaction_id: item.Transaction_id,
                                          Type: item.Type,
                                          amount: item.amount
                                        });
                                        setShowModal(true);
                                      }}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      className="btn btn-sm btn-danger"
                                      onClick={() => {
                                        setItemToDelete(item._id);
                                        setShowDelModal(item._id);
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </td>
                                )}
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
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setFund(false);
                setAmount("");
              }
            }}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content p-4">
                <div className="d-flex justify-content-end">
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => {
                      setFund(false);
                      setAmount("");
                    }}
                  ></button>
                </div>
                <div className="card p-4 shadow-sm" style={{ width: "450px" }}>
                  <h2 className="text-center mb-4">Enter Amount</h2>
                  <div className="mb-3">
                    <button className="btn btn-outline-primary me-2">
                      Current: ${totalFund.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </button>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <button
                    className="btn btn-success w-100"
                    onClick={sendMessage}
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
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setwithdraw(false);
                setAmount("");
              }
            }}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content p-4">
                <div className="d-flex justify-content-end">
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => {
                      setwithdraw(false);
                      setAmount("");
                    }}
                  ></button>
                </div>
                <div className="card p-4 shadow-sm" style={{ width: "450px" }}>
                  <h2 className="text-center mb-4">Enter Amount</h2>
                  <div className="mb-3">
                    <button className="btn btn-outline-primary me-2">
                      Current: ${totalFund.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </button>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <button
                    className="btn btn-danger w-100"
                    onClick={sendWithdrawMessage}
                  >
                    Withdraw Funds
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
      
        {showDelModal && (
          <div className="modal fade show" style={{ display: 'block' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button 
                    type="button" 
                    className="btn-close"
                    onClick={() => setShowDelModal(false)}
                  />
                </div>
                <div className="modal-body">
                  Are you sure you want to delete this order?
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowDelModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDelete(itemToDelete)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Transaction</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowModal(false);
                      setEditItem(null);
                    }}
                  />
                </div>
                <form onSubmit={handleEdit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Sender</label>
                      <input
                        type="text"
                        className="form-control"
                        name="sender"
                        value={editFormData.sender}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Format</label>
                      <select
                        className="form-control"
                        name="Format"
                        value={editFormData.Format}
                        onChange={handleEditInputChange}
                      >
                        <option value="fund">Fund</option>
                        <option value="withdraw">Withdraw</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Transaction ID</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Transaction_id"
                        value={editFormData.Transaction_id}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Type</label>
                      <select
                        className="form-control"
                        name="Type"
                        value={editFormData.Type}
                        onChange={handleEditInputChange}
                      >
                        <option value="pending">Pending</option>
                        <option value="success">Success</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Amount</label>
                      <input
                        type="number"
                        className="form-control"
                        name="amount"
                        value={editFormData.amount}
                        onChange={handleEditInputChange}
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowModal(false);
                        setEditItem(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

      
      </div>}
    </>
  );
};

export default FundBoard;
