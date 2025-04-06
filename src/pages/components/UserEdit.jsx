// UserEdit.jsx
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const UserEdit = ({ user, onSave, onClose }) => {
  const [editedUser, setEditedUser] = useState({
    _id: user._id,
    name: user.name || '',
    email: user.email || '',
    country: user.country || '',
    branch: user.branch || '',
    majority: user.majority || '',
    role: user.role || 'user',
    phoneNumber: user.phoneNumber || '',
    bank: user.bank || '',
    balance: user.balance || 0,
    logstatus: user.logstatus || false// Include logstatus if needed
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting edited user:', editedUser); // Debug log
    onSave(editedUser);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={editedUser.name}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={editedUser.email}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Country</Form.Label>
        <Form.Control
          type="text"
          name="country"
          value={editedUser.country}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Branch</Form.Label>
        <Form.Control
          type="text"
          name="branch"
          value={editedUser.branch}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Position</Form.Label>
        <Form.Control
          type="text"
          name="majority"
          value={editedUser.majority}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Role</Form.Label>
        <Form.Select
          name="role"
          value={editedUser.role}
          onChange={handleChange}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Phone Number</Form.Label>
        <Form.Control
          type="text"
          name="phoneNumber"
          value={editedUser.phoneNumber}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Bank</Form.Label>
        <Form.Control
          type="text"
          name="bank"
          value={editedUser.bank}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Balance</Form.Label>
        <Form.Control
          type="number"
          name="balance"
          value={editedUser.balance}
          onChange={handleChange}
        />
      </Form.Group>

      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </div>
    </Form>
  );
};

export default UserEdit;
