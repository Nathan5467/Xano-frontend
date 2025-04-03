// src/pages/components/Order_main.jsx
import React, { useEffect, useState } from "react";
import axios from "../../API/axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useTheme } from "../../context/ThemeContext";

// Styled Components
const StyledCard = styled.div`
  background-color: ${props => props.isDarkMode ? '#2d2d2d' : '#ffffff'};
  color: ${props => props.isDarkMode ? '#ffffff' : '#333333'};
  transition: all 0.3s ease;
`;

const StyledTable = styled.table`
  background-color: ${props => props.isDarkMode ? '#2d2d2d' : '#ffffff'};
  color: ${props => props.isDarkMode ? '#ffffff' : '#333333'};
  
  th {
    background-color: ${props => props.isDarkMode ? '#1a1a1a' : '#f8f9fa'};
  }
  
  tr:hover {
    background-color: ${props => props.isDarkMode ? '#3d3d3d' : '#f5f5f5'};
  }
`;

const StyledModal = styled.div`
  .modal-content {
    background-color: ${props => props.isDarkMode ? '#2d2d2d' : '#ffffff'};
    color: ${props => props.isDarkMode ? '#ffffff' : '#333333'};
  }
  
  .form-control {
    background-color: ${props => props.isDarkMode ? '#3d3d3d' : '#ffffff'};
    color: ${props => props.isDarkMode ? '#ffffff' : '#333333'};
    border-color: ${props => props.isDarkMode ? '#4d4d4d' : '#ced4da'};
    
    &:focus {
      background-color: ${props => props.isDarkMode ? '#4d4d4d' : '#ffffff'};
      color: ${props => props.isDarkMode ? '#ffffff' : '#333333'};
    }
  }
`;

const Order_main = () => {
  const { isDarkMode } = useTheme();
  const [page, setPage] = useState(1);
  const [positions, setPositions] = useState([]);
  const [selectItem, setSelectItem] = useState({});
  const [newItem, setNewItem] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [addShowModal, setAddShowModal] = useState(false);
  const [showDelModal, setShowDelModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const [token] = useState(JSON.parse(localStorage.getItem("auth")) || "");
  const decoded = jwtDecode(token);
  
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const header_menu = [
    { name: "Name", tag: "name" },
    { name: "Status", tag: "status" },
    { name: "Time", tag: "Time" },
    { name: "Type", tag: "Type" },
    { name: "Option", tag: "Option" },
    { name: "Net Qty.", tag: "Qty" },
    { name: "Order Value", tag: "value" },
    { name: "CMP", tag: "CMP" },
    { name: "Order Price", tag: "price" },
  ];

  // Fetch Orders
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/v1/Order");
      setPositions(response.data.order);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Update Order
  const handleUpdate = async () => {
    try {
      const response = await axios.put("/api/v1/Order", selectItem);
      if (response.status === 200) {
        setPositions(positions.map(item => 
          item._id === selectItem._id ? selectItem : item
        ));
        toast.success("Order updated successfully");
        setShowModal(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update order");
    }
  };

  // Add Order
  const handleAdd = async () => {
    try {
      const response = await axios.post("/api/v1/Order", newItem);
      setPositions([...positions, response.data]);
      toast.success("Order added successfully");
      setAddShowModal(false);
      setNewItem({});
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add order");
    }
  };

  // Delete Order
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/v1/Order/${id}`);
      setPositions(positions.filter(item => item._id !== id));
      toast.success("Order deleted successfully");
      setShowDelModal(false);
      setItemToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete order");
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  return (
    <StyledCard className="card shadow-sm" isDarkMode={isDarkMode}>
      {/* Header */}
      <div className="card-header bg-primary text-white">
        <div className="row align-items-center">
          <div className="col">
            <h4 className="card-title mb-0">All Orders</h4>
          </div>
          {decoded.role === "admin" && (
            <div className="col-auto">
              <button 
                className="btn btn-light btn-sm"
                onClick={() => setAddShowModal(true)}
              >
                Add New Order
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="card-body">
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <StyledTable className="table table-bordered table-hover" isDarkMode={isDarkMode}>
            <thead>
              <tr>
                {header_menu.map((item, index) => (
                  <th key={index}>{item.name}</th>
                ))}
                {decoded.role === "admin" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {positions
                .slice((page - 1) * 10, page * 10)
                .map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td className="text-center">
                      <span className={`badge bg-${
                        item.status === "successful" ? "success" :
                        item.status === "pending" ? "warning" : "danger"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{item.Time}</td>
                    <td>
                      <span className={item.Type === "B" ? "text-success" : "text-danger"}>
                        {item.Type}
                      </span>
                    
                    </td>
                    <td>{item.Option}</td>
                    <td>{item.Qty}</td>
                    <td>{item.value}</td>
                    <td>{item.CMP}</td>
                    <td>{item.price}</td>
                    {decoded.role === "admin" && (
                      <td>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => {
                            setSelectItem(item);
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
                ))}
            </tbody>
          </StyledTable>
        )}

        {/* Pagination */}
        <nav className="d-flex justify-content-end">
          <ul className="pagination">
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button 
                className="page-link"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>
            </li>
            {[...Array(Math.ceil(positions.length / 10))].map((_, i) => (
              <li 
                key={i}
                className={`page-item ${page === i + 1 ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${
              page === Math.ceil(positions.length / 10) ? 'disabled' : ''
            }`}>
              <button
                className="page-link"
                onClick={() => setPage(page + 1)}
                disabled={page === Math.ceil(positions.length / 10)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Edit Modal */}
      <StyledModal isDarkMode={isDarkMode}>
        {showModal && (
          <div className="modal fade show" style={{ display: 'block' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Order</h5>
                  <button 
                    type="button" 
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  />
                </div>
                <div className="modal-body">
                  {header_menu.map((item, index) => (
                    <div key={index} className="mb-3">
                      <label className="form-label">{item.name}</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectItem[item.tag] || ''}
                        onChange={(e) => setSelectItem({
                          ...selectItem,
                          [item.tag]: e.target.value
                        })}
                      />
                    </div>
                  ))}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleUpdate}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </StyledModal>

      {/* Add Modal */}
      <StyledModal isDarkMode={isDarkMode}>
        {addShowModal && (
          <div className="modal fade show" style={{ display: 'block' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New Order</h5>
                  <button 
                    type="button" 
                    className="btn-close"
                    onClick={() => setAddShowModal(false)}
                  />
                </div>
                <div className="modal-body">
                  {header_menu.map((item, index) => (
                    <div key={index} className="mb-3">
                      <label className="form-label">{item.name}</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newItem[item.tag] || ''}
                        onChange={(e) => setNewItem({
                          ...newItem,
                          [item.tag]: e.target.value
                        })}
                      />
                    </div>
                  ))}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setAddShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAdd}
                  >
                    Add Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </StyledModal>

      {/* Delete Confirmation Modal */}
      <StyledModal isDarkMode={isDarkMode}>
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
      </StyledModal>
    </StyledCard>
  );
};

export default Order_main;
