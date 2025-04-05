import React, { useEffect, useState } from "react";
import axios from "../../API/axios";
import { jwtDecode } from "jwt-decode";
import deleteIcon from "../../assets/redTrashIcon.png";
import editIcon from "../../assets/edit.png";
import { Button, Modal } from "react-bootstrap";

const Portfolio = () => {
  const [page, setPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [token] = useState(
    JSON.parse(localStorage.getItem("auth")) || ""
  );

  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const decoded = jwtDecode(token);
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [addPortfolioModal, setAddPortfolioModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState([]);
  const [stock_value, setStock_value] = useState([]);
  const url = "/api/v1/getTransacton_history";
  const [showDelModal, setShowDelModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState("");
  const [quantity, setQuantity] = useState(0);
  const openDelModal = (id) => {
    setItemToDelete(id);
    setShowDelModal(true);
  };
  const closeDelModal = () => {
    setItemToDelete(null);
    setShowDelModal(false);
  };

  const [selectItem, setSeleceItem] = useState({
    stocks: "",
    qty: 0,
    avg: 0,
    cmp: 0,
    val_cost: 0,
    val_cmp: 0,
    return: 0,
    owner: decoded.name,
    day_gain: 0,
  });
  
  const [newItem, setnewItem] = useState({});
  const header_menu = [
    {
      name: "Stocks",
      tag: "stocks",
    },
    {
      name: "Qty",
      tag: "qty",
    },
    {
      name: "Avg.Price",
      tag: "avg",
    },
    {
      name: "CMP Price",
      tag: "cmp",
    },
    {
      name: "Value at Cost",
      tag: "val_cost",
    },
    {
      name: "Value at Cmp",
      tag: "val_cmp",
    },
    {
      name: "Day's Gain",
      tag: "day_gain",
    },
    {
      name: "return",
      tag: "return",
    },
    {
      name: "Owner",
      tag: "owner",
    },
  ];
  const Save = async () => {
    let new_stock = stock_value.map((i) =>
      i._id === selectItem._id ? selectItem : i
    );
    setStock_value(new_stock);
    const response = await axios.put(url, selectItem);
    setShowModal(false);
  };
  const Add = async () => {
    try {
    let new_stock = [...stock_value, newItem];
    setStock_value(new_stock);
    const response = await axios.post(url, newItem);
    console.log(response.data);
    setAddModal(false);
  } catch (error) {
    console.error("Error adding item:", error);
  }
  };

  const handleDelete = async (id) => {    
    await axios.delete(`/api/v1/getTransacton_history/${id}`);
    setStock_value(stock_value.filter((item) => item._id !== id));
    setShowDelModal(false);
  };

  const SavePortfolio = async () => {
    try {
      const portfolioItem = {
        stocks: selectedStock,
        qty: quantity,
        Type: "pending",
        owner: decoded.name,
        avg: 0,
        cmp: 0,
        val_cost: 0,
        val_cmp: 0,
        day_gain: 0,
        return: 0,
        // Add other required fields here
      };
      const response = await axios.post(url, portfolioItem);
      setAddPortfolioModal(false);
      setSelectedStock("");
      setQuantity(0);
      
      // Optionally refresh the data
      // fetchData();  // If you have a function to refresh the data
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const response = await axios.get(url);
        const sortedData = response.data.transaction.sort((a, b) => {
          const dateA = new Date(`${a.Date}T${a.Time}`);
          const dateB = new Date(`${b.Date}T${b.Time}`);
          return dateB - dateA; // Sort in descending order
        });
        setStock_value([...sortedData]);
        
      } catch (error) {
        console.log(
          "Error:",
          error.response ? error.response.data : error.message
        );
      }
    };
    fetchData();

  }, [token , url]);
  const totalPages = Math.ceil(stock_value.length / 10);
  const userStock = stock_value.filter((item) => item.owner === decoded.name);
  const userPages = Math.ceil(userStock.length / 10);

const [stocksList, setStocksList] = useState([]);  // Initialize with empty array instead of null

useEffect(() => {
  if (stock_value && stock_value.length > 0) {  // Check if stock_value exists and has data
    setStocksList(stock_value.map((item) => item.stocks));
  }
}, [stock_value]);  // Dependency on stock_value
  
  return (
    <div className="container mt-4">
      {/* <Header_sub /> */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <div className="row align-items-center">
                <div className="col">
                  <h4 className="card-title m-0">Portfolio</h4>
                </div>
                <div className="col-auto">
                  <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item">
                      <a
                        className="nav-link active text-info"
                        data-bs-toggle="tab"
                        href="#Stocks"
                        role="tab"
                        aria-selected="true"
                      >
                        Stocks
                      </a>
                    </li>
                    {decoded.role === "admin" ? <li className="nav-item">
                      <a
                        className="nav-link text-info"
                        data-bs-toggle="tab"
                        href="#Stocks"
                        role="tab"
                        aria-selected="false"
                        onClick={() => {
                            setAddModal(true);
                        }}
                      >
                        Add
                      </a>
                    </li>:<li className="nav-item">
                      <a
                        className="nav-link text-info"
                        data-bs-toggle="tab"
                        href="#Stocks"
                        role="tab"
                        aria-selected="false"
                        onClick={() => {
                            setAddPortfolioModal(true);
                        }}
                      >
                        Add
                      </a>
                    </li>}
                  </ul>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="tab-content" id="Amount_history">
                <div
                  className="tab-pane fade show active"
                  id="Stocks"
                  role="tabpanel"
                  aria-labelledby="Stocks-tab"
                >
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover text-center">
                      <thead className="thead-light text-center">
                        <tr>
                          <th>Stocks</th>
                          <th>Qty.</th>
                          <th>Avg. Price</th>
                          <th>CMP Price</th>
                          <th>Value at Cost</th>
                          <th>Value at CMP</th>
                          <th>Day's Gain</th>
                          <th>Return</th>
                          {decoded.role === "admin" && <th>Owner</th>}
                          <th>Status</th>                       
                          {decoded.role === "admin" && (<th>Action</th>)}
                        </tr>
                      </thead>
                      {decoded.role === "admin" && <tbody>
                        {stock_value.map((item, index) => {
                          if (index > 10 * page - 11 && index < 10 * page)
                            return (
                              (item.owner === decoded.name || decoded.role === "admin" )&& <tr
                                key={index}
                                className="cursor-pointer text-center"
                              >
                                <td>{item.stocks}</td>
                                <td>{item.qty}</td>
                                <td>{item.avg}</td>
                                <td>{item.cmp}</td>
                                <td>{item.val_cost}</td>
                                <td>{item.val_cmp}</td>
                                <td className={item.day_gain < 0 ? 'text-danger' : 'text-success'}>{item.day_gain}</td>
                                <td className={item.return < 0 ? 'text-danger' : 'text-success'}>{item.return}</td>
                                {decoded.role === "admin" && <td className={item.Type === "failed" ? 'text-danger' : item.Type === "pending" ? 'text-warning' : 'text-success'}>{item.owner}</td>}
                                <td className={`badge bg-${
                                  item.Type === "success" ? "success" :
                                  item.Type === "pending" ? "warning" : "danger"
                                }`}>{item.Type}</td>
                                {decoded.role === "admin" && (
                                  <td>
                                    <img
                                      src={editIcon}
                                      width={20}
                                      alt="edit"
                                      className="ti ti-pencil text-white email-action-icons-item mx-1"
                                      onClick={() => {
                                        setShowModal(true);
                                        setSeleceItem(item);
                                      }}
                                    ></img>
                                    <img
                                      src={deleteIcon}
                                      width={20}
                                      alt="delete"
                                      onClick={() => openDelModal(item._id)}
                                      className="ti ti-pencil text-white email-action-icons-item mx-1"
                                    ></img>
                                </td>)} 
                              </tr>
                            );
                        })}
                      </tbody>}
                      {decoded.role === "user" && <tbody>
                        {userStock.map((item, index) => {
                          if (index > 10 * page - 11 && index < 10 * page)
                            return (
                              (item.owner === decoded.name || decoded.role === "admin" )&& <tr
                                key={index}
                                className="cursor-pointer text-center"
                              >
                                <td>{item.stocks}</td>
                                <td>{item.qty}</td> 
                                <td  className={item.avg === 0 ? 'bg-secondary' : ''}>{item.avg}</td>
                                <td className={item.avg === 0 ? 'bg-secondary' : ''}>{item.cmp}</td>
                                <td className={item.avg === 0 ? 'bg-secondary' : ''}>{item.val_cost}</td>
                                <td className={item.avg === 0 ? 'bg-secondary' : ''}>{item.val_cmp}</td>
                                <td className={item.day_gain < 0 ? 'text-danger' : 'text-success'}>{item.day_gain}</td>
                                <td className={item.return < 0 ? 'text-danger' : 'text-success'}>{item.return}</td>
                                {decoded.role === "admin" && <td>{item.owner}</td>}
                                <td className={`badge bg-${
                                  item.Type === "success" ? "success" :
                                  item.Type === "pending" ? "warning" : "danger"
                                }`}>{item.Type}</td>
                                {decoded.role === "admin" && (
                                  <td>
                                    <img
                                      src={editIcon}
                                      width={20}
                                      alt="edit"
                                      className="ti ti-pencil text-white email-action-icons-item mx-1"
                                      onClick={() => {
                                        setShowModal(true);
                                        setSeleceItem(item);
                                      }}
                                    ></img>
                                    <img
                                      src={deleteIcon}
                                      width={20}
                                      alt="delete"
                                      onClick={() => openDelModal(item._id)}
                                      className="ti ti-pencil text-white email-action-icons-item mx-1"
                                    ></img>
                                </td>)} 
                              </tr>
                            );
                        })}
                      </tbody>}
                    </table>
                  </div>
                  <nav aria-label="Page navigation" className="float-end">
                      {decoded.role === "admin" && <ul className="pagination pagination-sm mb-0">
                        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                          <a
                            className="page-link"
                            onClick={() => {
                              if (page > 1) setPage((item) => item - 1);
                            }}
                          >
                            Previous
                          </a>
                        </li>
                        {[...Array(totalPages)].map((_, index) => (
                          <li
                            key={index}
                            className={`page-item ${page === index + 1 ? "active" : ""}`}
                          >
                            <a
                              className="page-link"
                              onClick={() => setPage(index + 1)}
                            >
                              {index + 1}
                            </a>
                          </li>
                        ))}
                        <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                          <a
                            className="page-link"
                            onClick={() => {
                              if (page < totalPages) setPage((item) => item + 1);
                            }}
                          >
                            Next
                          </a>
                        </li>
                      </ul>}
                      {decoded.role === "user" && <ul className="pagination pagination-sm mb-0">
                        <li className={`page-item ${userPage === 1 ? "disabled" : ""}`}>
                          <a
                            className="page-link"
                            onClick={() => {
                              if (userPage > 1) setUserPage((item) => item - 1);
                            }}
                          >
                            Previous
                          </a>
                        </li>
                        {[...Array(userPages)].map((_, index) => (
                          <li
                            key={index}
                            className={`page-item ${userPage === index + 1 ? "active" : ""}`}
                          >
                            <a
                              className="page-link"
                              onClick={() => setUserPage(index + 1)}
                            >
                              {index + 1}
                            </a>
                          </li>
                        ))}
                        <li className={`page-item ${userPage === userPages ? "disabled" : ""}`}>
                          <a
                            className="page-link"
                            onClick={() => {
                              if (userPage < userPages) setUserPage((item) => item + 1);
                            }}
                          >
                            Next
                          </a>
                        </li>
                      </ul>}
                  </nav>
                </div>
              </div>
            </div>     
          </div>
        </div>
      </div>
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
              <div className="card p-4 shadow-sm modal-content">
                <h3 className="text-center mb-4">Edit Transaction History</h3>
                <form>
                  {header_menu.map((item, index) => (
                    <div
                      key={index}
                      className="row align-items-center mb-3"
                    >
                      <div className="col-md-5">
                        <h6 className="mb-0">{item.name}</h6>
                      </div>
                      <div className="col-md-7">
                        <input
                          type="text"
                          className="form-control"
                          name={item.tag}
                          value={selectItem[item.tag]}
                          onChange={(e) => {
                            const updatedItem = {
                              ...selectItem,
                              [item.tag]: e.target.value,
                            };
                            setSeleceItem(updatedItem);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="d-flex justify-content-between mt-4">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={Save}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
      )}

    {addPortfolioModal && (
      <div
        className="modal fade show"
        style={{ display: "block" }}
        tabIndex="1"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          {/* <div className="">*/}
            <div className="card p-4 shadow-sm modal-content"> 
              <h3 className="text-center mb-4">Add Portfolio</h3>
              <form>
                <div className="row align-items-center mb-3">
                  <div className="col-md-5">
                    <h6 className="mb-0">Stock Name</h6>
                  </div>
                  <div className="col-md-7">
                    <select
                      className="form-select"
                      value={selectedStock}
                      onChange={(e) => {
                        setSelectedStock(e.target.value);
                        setnewItem({
                          ...newItem,
                          stocks: e.target.value
                        });
                      }}
                    >
                      <option value="">Select a stock</option>
                      {stocksList.map((stock, index) => (
                        <option key={index} value={stock}>
                          {stock}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row align-items-center mb-3">
                  <div className="col-md-5">
                    <h6 className="mb-0">Quantity</h6>
                  </div>
                  <div className="col-md-7 d-flex align-items-center">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        if (quantity > 0) {
                          setQuantity(quantity - 1);
                          setnewItem({
                            ...newItem,
                            qty: quantity - 1
                          });
                        }
                      }}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="form-control mx-2"
                      value={quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setQuantity(value);
                        setnewItem({
                          ...newItem,
                          qty: value
                        });
                      }}
                      style={{ width: "80px" }}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setQuantity(quantity + 1);
                        setnewItem({
                          ...newItem,
                          qty: quantity + 1
                        });
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="d-flex justify-content-between mt-4">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={SavePortfolio}
                    disabled={!selectedStock || quantity === 0}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setAddPortfolioModal(false);
                      setSelectedStock("");
                      setQuantity(0);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      // </div>
    )}
      {addModal && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            {/* <div className=" p-4"> */}
              <div className="card p-4 shadow-sm modal-content">
                <h3 className="text-center mb-4">Add Transaction History</h3>
                <form>
                  {header_menu.map((item, index) => (
                    <div
                      key={index}
                      className="row align-items-center mb-3"
                    >
                      <div className="col-md-5">
                        <h6 className="mb-0">{item.name}</h6>
                      </div>
                      <div className="col-md-7">
                        <input
                          type="text"
                          className="form-control"
                          name={item.tag}
                          value={newItem[item.tag]}
                          onChange={(e) => {
                            const updatedItem = {
                              ...newItem,
                              [item.tag]: e.target.value,
                            };
                            setnewItem(updatedItem);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="d-flex justify-content-between mt-4">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={Add}
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setAddModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        // </div>
      )}

      {/* Modal for Deletion Confirmation */}
      <Modal show={showDelModal} onHide={closeDelModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this transaction? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDelModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDelete(itemToDelete)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Portfolio;
