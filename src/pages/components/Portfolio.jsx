import React, { useEffect, useState } from "react";
import axios from "../../API/axios";
import Header_sub from "./Header_sub";
import { jwtDecode } from "jwt-decode";

const Portfolio = () => {
  const [page, setPage] = useState(1);
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("auth")) || ""
  );

  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const decoded = jwtDecode(token);
  const [selectItem, setSeleceItem] = useState({
    stocks: "",
    tie: 0,
    avg: 0,
    cmp: 0,
    value_cost: 0,
    value_cmp: 0,
    day_gain: 0,
    returun: 0,
  });
  const [showModal, setShowModal] = useState(false);

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
      tag: "value_cost",
    },
    {
      name: "Value at CMP",
      tag: "value_cmp",
    },
    {
      name: "Day's Gain",
      tag: "day_gain",
    },
    {
      name: "Retururn",
      tag: "returun",
    },
  ];

  const [stock_value, setStock_value] = useState([]);

  const url = "/api/v1/getTransacton_history";

  const Save = async () => {
    let new_stock = stock_value.map((i) =>
      i._id === selectItem._id ? selectItem : i
    );
    setStock_value(new_stock);
    const response = await axios.post(url, selectItem);
    setShowModal(false);
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
  }, [token]);

  const totalPages = Math.ceil(stock_value.length / 10);

  return (
    <div className="container mt-4">
      <Header_sub />
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <div className="row align-items-center">
                <div className="col">
                  <h4 className="card-title m-0">Transaction History</h4>
                </div>
                <div className="col-auto">
                  <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item">
                      <a
                        className="nav-link active"
                        data-bs-toggle="tab"
                        href="#Stocks"
                        role="tab"
                        aria-selected="true"
                      >
                        Stocks
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href="#Mutual_funds"
                        role="tab"
                        aria-selected="false"
                      >
                        Mutual Funds
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
                  id="Stocks"
                  role="tabpanel"
                  aria-labelledby="Stocks-tab"
                >
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead className="thead-light">
                        <tr>
                          <th>Stocks</th>
                          <th>Qty.</th>
                          <th>Avg. Price</th>
                          <th>CMP Price</th>
                          <th>Value at Cost</th>
                          <th>Value at CMP</th>
                          <th>Day's Gain</th>
                          <th>Return</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stock_value.map((item, index) => {
                          if (index > 10 * page - 11 && index < 10 * page)
                            return (
                              <tr
                                key={index}
                                onClick={() => {
                                  if (decoded.role === "admin") {
                                    setShowModal(true);
                                    setSeleceItem(item);
                                  }
                                }}
                                className="cursor-pointer"
                              >
                                <td>{item.stocks}</td>
                                <td>{item.qty}</td>
                                <td>{item.avg}</td>
                                <td>{item.cmp}</td>
                                <td>{item.value_cost}</td>
                                <td>{item.value_cmp}</td>
                                <td className="text-success">{item.day_gain}</td>
                                <td className="text-success">{item.returun}</td>
                              </tr>
                            );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <nav aria-label="Page navigation" className="float-end">
                    <ul className="pagination pagination-sm mb-0">
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
                    </ul>
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
            <div className="modal-content p-4">
              <div className="card p-4 shadow-sm">
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
        </div>
      )}
    </div>
  );
};

export default Portfolio;
