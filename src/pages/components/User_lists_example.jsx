{currentUsers.map((item) => (
                      <tr key={item._id}>
                        <td>{item.name}</td>
                        <td>{item.location || 'N/A'}</td>
                        <td>{item.position || 'N/A'}</td>
                        <td>{item.logstatus ? 'Active' : 'Inactive'}</td>
                        <td>{item.role || 'N/A'}</td>
                        <td>{item.phone || 'N/A'}</td>
                        <td>{item.bank || 'N/A'}</td>
                        <td>{item.balance || '0'}</td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm me-2"
                            onClick={() => openEditModal(item)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => openModal(item._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))