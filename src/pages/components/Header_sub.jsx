import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap CSS is imported
import axios from "../../API/axios";
import { jwtDecode } from "jwt-decode";

const Header_sub = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  //const [value, setValue] = useState();
  const [token] = useState(
    JSON.parse(localStorage.getItem("auth")) || ""
  );
  const decoded = jwtDecode(token);
  const [stock_state, setStock_state] = useState([]);
  const url = "/api/v1/getTotal_fund";
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        setStock_state([...response.data.total_fund]);
      } catch (error) {
        console.log(
          "Error:",
          error.response ? error.response.data : error.message
        );
      }
    };
    fetchData();
  }, []);

  const openModal = (item) => {
    if (decoded.role === "admin") {
      setSelectedItem({...item});
      setShowModal(true);
    }
  };

  const closeModal = () => {
    if (decoded.role === "admin") {
      setShowModal(false);
      setSelectedItem(null);
    }
  };

  const saveModal = async () => {
    if (!selectedItem) return;

    // Create a new updated stock state
    const new_stock = stock_state.map((i) =>
      i._id === selectedItem._id ? { ...i, value: selectedItem.value } : i
    );
    setStock_state(new_stock);

    try {
      await axios.post(url, new_stock);
    } catch (error) {
      console.log(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }

    setShowModal(false);
    setSelectedItem(null);
  };

  useEffect(() => {}, [stock_state]);

  return (
    <div className="container">
      <div className="row">
        {stock_state.map((item, index) => (
          <div
            className="col-md-6 col-lg-3"
            key={index}
            onClick={() => openModal(item)}
          >
            <div className="card">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col text-center">
                    <span className="h5">{item.name}</span>
                    <h6 className="text-uppercase font-11 text-muted mt-2 m-0">
                      {item.value}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal"
          style={{ display: "block" }}
          tabIndex="1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <form>
              {}
              <div className="modal-content">
                <div className="modal-header">                  
                  <h5 className="modal-title">{selectedItem?.name}</h5>
                  <button
                    type="button"
                    className="close btn-red"
                    onClick={closeModal}
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <p>Value: </p>
                  <input
                    type="text"
                    //placeholder={selectedItem?.value}
                    //onChange={(e) => setValue(e.target.value)}
                    value={selectedItem?.value || ""} // Updated line
                    onChange={(e) => 
                      setSelectedItem({ ...selectedItem, value: e.target.value }) // Updated line
                    }
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      saveModal(selectedItem);
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header_sub;
