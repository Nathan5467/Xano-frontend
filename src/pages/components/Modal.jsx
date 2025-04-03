import React from 'react';
import { Modal as BootstrapModal } from 'react-bootstrap';
import UserEdit from './UserEdit';

export const UserEditModal = ({ show, onHide, user }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      className={`custom-modal ${isDarkMode ? 'dark' : 'light'}`}
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="p-3">
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              className="form-control-modern"
            />
          </Form.Group>
          {/* Add other form fields */}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};