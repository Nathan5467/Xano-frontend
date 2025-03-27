import React, { useEffect, useState } from "react";
import axios from "../../API/axios";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
import { Button, Modal, Pagination } from "react-bootstrap";
import { FaSort } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const User_lists = () => {
  const [token] = useState(JSON.parse(localStorage.getItem("auth")) || "");
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [sortDirection, setSortDirection] = useState('desc');

  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/v1/getAllusers");
      const sortedUsers = response.data.users.sort((a, b) => {
        return sortDirection === 'desc' 
          ? Number(b.logstatus) - Number(a.logstatus)
          : Number(a.logstatus) - Number(b.logstatus);
      });
      setUsers(sortedUsers);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/v1/getAllusers/${id}`);
    setUsers(users.filter((item) => item._id !== id));
    setShowModal(false);
  };

  const openModal = (id) => {
    setItemToDelete(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setItemToDelete(null);
    setShowModal(false);
  };

  useEffect(() => {
    fetchData();
  }, [sortDirection]);

  const decoded = JSON.parse(atob(token.split('.')[1]));

  // Get current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handleSort = () => {
    setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  return (
    <div className="container-fluid">
      <h3 className="mb-4 text-center text-primary">User List</h3>
      <MDBTable align="middle" hover responsive>
        <MDBTableHead>
          <tr className="text-center">
            <th scope="col">Name</th>
            <th scope="col">Title</th>
            <th scope="col" onClick={handleSort} style={{ cursor: 'pointer' }}>
              Status <FaSort />
            </th>
            <th scope="col">Role</th>
            <th scope="col">Phone Number</th>
            {decoded.role === "admin" && <th scope="col">Actions</th>}
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {currentUsers.map((user) => (
            <tr key={user._id} className="text-center">
              <td>
                <div className="d-flex align-items-center">
                  <img
                    src={user.avatar}
                    alt="avatar"
                    style={{ width: "45px", height: "45px" }}
                    className="rounded-circle"
                  />
                  <div className="ms-2">
                    <p className="fw-bold mb-1">{user.name}</p>
                    <p className="text-muted mb-0">{user.email}</p>
                  </div>
                </div>
              </td>
              <td>
                <p className="fw-normal mb-1">{user.majority}</p>
                <p className="text-muted mb-0">{user.country}</p>
              </td>
              <td className={user.logstatus ? "text-success" : "text-warning"}>
                {user.logstatus ? "Logged In" : "Logged Out"}
              </td>
              <td className={user.role === "admin" ? "text-danger" : "text-primary"}>
                {user.role}
              </td>
              <td>{user.phoneNumber}</td>
              {decoded.role === "admin" && (
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => openModal(user._id)}
                  >
                    Delete
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          <Pagination.First 
            onClick={() => setCurrentPage(1)} 
            disabled={currentPage === 1}
          />
          <Pagination.Prev 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages)].map((_, idx) => (
            <Pagination.Item
              key={idx + 1}
              active={idx + 1 === currentPage}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          />
          <Pagination.Last 
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>

      {/* Modal for Deletion Confirmation */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this user? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
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

export default User_lists;
