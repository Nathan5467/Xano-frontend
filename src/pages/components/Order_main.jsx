import React, { useEffect, useState } from "react";
import { positions } from "../../entry/order_position";
import axios from "../../API/axios";
import { jwtDecode } from "jwt-decode";
import editIcon from "../../assets/edit.png";
import redTrashIcon from "../../assets/redTrashIcon.png"; // Corrected path

const Order_main = () => {
  const [page, setpage] = useState(1);
  const url = "/api/v1/getOrder";
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("auth")) || ""
  );
  
  const decoded = jwtDecode(token);
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const [selectItem, setSelectItem] = useState({});
  const header_menu = [
    {
      name: "Name",
      tag: "name",
    },
    {
      name: "Status",
      tag: "status",
    },
    {
      name: "Time",
      tag: "Time",
    },
    {
      name: "Type",
      tag: "Type",
    },
    {
      name: "Option",
      tag: "Option",
    },
    {
      name: "Net Qty.",
      tag: "Qty",
    },
    {
      name: "Order Value",
      tag: "value",
    },
    {
      name: "CMP",
      tag: "CMP",
    },
    {
      name: "Order Price",
      tag: "price",
    },
  ];

  const [positions, setPosition] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const Save = async () => {
    let new_positions = positions.map((i) =>
      i._id === selectItem._id ? selectItem : i
    );
    setPosition(new_positions);
    const response = await axios.post(url, selectItem);
    setShowModal(false);
  };

  const deleteItem = async (id) => {
    const response = await axios.delete(`${url}/${id}`);
    setPosition(response.data.order);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(url);
      setPosition([...response.data.order]);
    } catch (error) {
      console.log(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    fetchData();
    // Clean up the interval on component unmount
  }, [token]);

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white">
        <div className="row align-items-center">
          <div className="col">
            <h4 className="card-title mb-0">All Positions</h4>
          </div>
          <div className="col-auto">
            <ul className="nav nav-tabs tab-nagative-m" role="tablist">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  data-bs-toggle="tab"
                  href="#Open"
                  role="tab"
                  aria-selected="true"
                >
                  Open
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#Close"
                  role="tab"
                  aria-selected="false"
                >
                  Close
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="tab-content" id="Amount_history">
          <div
            className="tab-pane fade show active"
            id="Open"
            role="tabpanel"
            aria-labelledby="Open-tab"
          >
            <div className="table-responsive">
              <table className="table table-bordered table-hover table-striped">
                <thead className="thead-light">
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Time</th>
                    <th colspan="2">Type</th>
                    <th>Net Qty.</th>
                    <th>Order Value</th>
                    <th>CMP</th>
                    <th>Order Price</th>
                    {decoded.role === "admin" && <th>Action</th>}
                  </tr>
                </thead>

                <tbody>
                  {positions.map((item, index) => {
                    if (index > 10 * page - 11)
                      if (index < 10 * page)
                        return (
                          <tr key={index}>
                            <td>{item.name}</td>
                            <td>
                              <span
                                className ={(item.status === "successful")? "text-success" 
                                  :(item.status === "pending") ? "text-warning":
                                  "text-danger"}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td>{item.Time}</td>
                            <td>{item.Option}</td>
                            <td>
                              <span className={(item.Type === "B")? "text-success":"text-danger"}>
                                  {item.Type}
                              </span>
                            </td>
                            <td>{item.Qty}</td>
                            <td>{item.value}</td>
                            <td>{item.CMP}</td>
                            <td>{item.price}</td>
                            {decoded.role === "admin" && (
                              <td>
                                <img
                                  src={editIcon}
                                  width={20}
                                  alt="edit"
                                  className="ti ti-pencil text-white email-action-icons-item mx-1"
                                  onClick={() => {
                                    openModal();
                                    setSelectItem(item);
                                  }}
                                ></img>
                                <img
                                  src={redTrashIcon}
                                  width={20}
                                  alt="delete"
                                  className="ti ti-x text-white email-action-icons-item color-danger mx-1"
                                  onClick={() => {
                                    deleteItem(item._id);
                                  }}
                                ></img>
                              </td>
                            )}
                          </tr>
                        );
                  })}
                </tbody>
              </table>
            </div>
            <nav aria-label="Pagination" className="d-flex justify-content-end">
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setpage(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                </li>
                {[...Array(Math.ceil(positions.length / 10)).keys()].map((p) => (
                  <li
                    key={p}
                    className={`page-item ${page === p + 1 ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setpage(p + 1)}
                    >
                      {p + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    page === Math.ceil(positions.length / 10) ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setpage(page + 1)}
                    disabled={page === Math.ceil(positions.length / 10)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          role="dialog"
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ backgroundColor: "#e4e4e4" }}
            role="document"
          >
            <div className="modal-content border-5 p-4">
              <h3 className="mb-4 text-center">Edit Stock</h3>
              <form>
                {header_menu.map((item, index) => (
                  <div key={index} className="mb-3 row align-items-center">
                    <label className="col-md-4 col-form-label">
                      {item.name}
                    </label>
                    <div className="col-md-8">
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
                          setSelectItem(updatedItem);
                        }}
                      />
                    </div>
                  </div>
                ))}
                <div className="d-flex justify-content-center">
                  <button
                    type="button"
                    className="btn btn-primary me-2"
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
    </div>
  );
};

export default Order_main;
