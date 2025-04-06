// User_lists.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux'; // Add this
import axios from "../../API/axios";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
import { FaSort } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import UserEdit from "./UserEdit";
import { updateUser, deleteUser, setUsers } from '../../redux/slice/userSlice'; // Add this
import { toast } from 'react-toastify';
import { Button, Modal, Pagination, Form } from "react-bootstrap";



const User_lists = () => {
  const dispatch = useDispatch(); // Add this
  const users = useSelector(state => state.users.userList); // Add this
  
  const [token] = useState(JSON.parse(localStorage.getItem("auth")) || "");
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [sortDirection, setSortDirection] = useState('desc');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  useEffect(() => {
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setCurrentUserRole(decodedToken.role);
      // Set the authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log('Authorization header set:', axios.defaults.headers.common["Authorization"]);
    }
  }, [token]);

  const canEditDelete = currentUserRole === 'admin';

  // Use useCallback for fetchData
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("/api/v1/getAllusers");
      const sortedUsers = response.data.users.sort((a, b) => {
        return sortDirection === 'desc' 
          ? Number(b.logstatus) - Number(a.logstatus)
          : Number(a.logstatus) - Number(b.logstatus);
      });
      dispatch(setUsers(sortedUsers));
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  }, [dispatch, sortDirection]);

  const handleResetPassword = (userId) => {
    setResetPasswordUser(userId);
    setNewPassword('');
    setConfirmPassword('');
    setShowResetModal(true);
  };
  
  const closeResetModal = () => {
    setResetPasswordUser(null);
    setNewPassword('');
    setConfirmPassword('');
    setShowResetModal(false);
  };
  
  const submitPasswordReset = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
  
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
  
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    try {
      const response = await axios.put(`/api/v1/resetPassword/${resetPasswordUser}`, {
        newPassword
      });
  
      if (response.status === 200) {
        toast.success("Password reset successful");
        closeResetModal();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    }
  };
  

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/v1/getAllUsers/${id}`);
      if (response.status === 200) {
        dispatch(deleteUser(id));
        setShowModal(false);
        alert("User deleted successfully");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete user. " + (error.response?.data?.message || error.message));
    }
  };
  
  const handleSave = async (updatedUserData) => {
    try {
  
      const dataToUpdate = {
        _id: updatedUserData._id,
        name: updatedUserData.name,
        email: updatedUserData.email,
        country: updatedUserData.country,
        branch: updatedUserData.branch,
        majority: updatedUserData.majority,
        role: updatedUserData.role,
        phoneNumber: updatedUserData.phoneNumber,
        bank: updatedUserData.bank,
        balance: updatedUserData.balance,
        logstatus: updatedUserData.logstatus
      };

      const response = await axios.put(`/api/v1/updateUser/${updatedUserData._id}`, dataToUpdate);
      console.log('Update response:', response);
      if (response.status === 200) {
        // Update Redux store with the response data
        dispatch(updateUser(dataToUpdate)); // Use the same data we sent
        closeEditModal();
        alert("User updated successfully");
        fetchData(); // Refresh the data
      }
    } catch (error) {
      console.error("Update error details:", error);
      alert(`Failed to update user. ${error.response?.data?.message || error.message}`);
    }
  };
  const openEditModal = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setSelectedUser(null);
    setShowEditModal(false);
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
  }, [fetchData, sortDirection]);

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
            <th scope="col-1"></th>
            <th scope="col-1">Name</th>
            <th scope="col-1">Country/City</th>
            <th scope="col-1">Position</th>
            <th scope="col-1" onClick={handleSort} style={{ cursor: 'pointer' }}>
              Status <FaSort />
            </th>
            <th scope="col-1">Role</th>
            <th scope="col-1">Phone Number</th>
            <th scope="col-1">Bank</th>
            <th scope="col-1">Balance</th>
            {canEditDelete && <th scope="col-1">Actions</th>}
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {currentUsers.map((user) => (
            <tr key={user._id} className="text-center">
              <td className="text-center">
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="rounded-circle"
                  width="50"
                  height="50"
                />
              </td>
              <td>
                <div className="d-flex align-items-center">                  
                  <div className="ms-2">
                    <p className="fw-bold mb-1">{user.name}</p>
                    <p className="text-muted mb-0">{user.email}</p>                                      
                  </div>
                </div>
              </td>             
              <td>
                <p className="fw-bold mb-1">{user.country}</p>
                <p className="text-muted mb-0">{user.branch}</p>
              </td>
              <td>
                <p className="fw-normal mb-1">{user.majority}</p>
              </td>
              <td className={user.logstatus ? "text-success" : "text-warning"}>
                <span
                  className="dot"
                  style={{
                    backgroundImage: user.logstatus 
                      ? 'radial-gradient(lightgreen, green)' 
                      : 'radial-gradient(orange, red)',
                    height: '25px',
                    width: '25px',
                    borderRadius: '50%',
                    display: 'inline-block',
                  }}
                ></span>
              </td>
              <td className={user.role === "admin" ? "text-danger" : "text-primary"}>
                {user.role}
              </td>
              <td>{user.phoneNumber}</td>
              <td>{user.bank}</td>
              <td>{user.balance}</td>             
              {canEditDelete && (
                <td>
                  <Button
                    className="me-2"
                    variant="warning"
                    size="sm"
                    onClick={() => handleResetPassword(user._id)} 
                  >
                    Reset Password
                  </Button>
                  <Button
                    className="me-2"
                    variant="primary"
                    size="sm"
                    onClick={() => openEditModal(user)}
                  >
                    Edit
                  </Button>

                  {user.role !== "admin" && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => openModal(user._id)}
                    >
                      Delete
                    </Button>
                  )}
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

      {/* Delete Confirmation Modal */}
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

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={closeEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <UserEdit 
              user={selectedUser} 
              onSave={handleSave}
              onClose={closeEditModal}
            />
          )}
        </Modal.Body>
      </Modal>

      {/* Reset Password Modal */}
      <Modal show={showResetModal} onHide={closeResetModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeResetModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submitPasswordReset}>
            Reset Password
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default User_lists;
