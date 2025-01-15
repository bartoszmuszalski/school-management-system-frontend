import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ClassRoom.css"; // Ensure consistent styling
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation

function ClassRoom() {
  const [classRooms, setClassRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate(); // Initialize navigate function

  // States for Edit Popup
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [editClassRoomId, setEditClassRoomId] = useState(null);
  const [editClassRoomName, setEditClassRoomName] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  // State for Success Notification
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const location = useLocation(); // Initialize useLocation

  useEffect(() => {
    // Check for success message from navigation state
    if (location.state && location.state.successMessage) {
      setSuccessMessage(location.state.successMessage);
      setShowSuccess(true);
      // Clear the state to prevent repeated popups on re-render
      navigate(location.pathname, { replace: true, state: {} });
      setTimeout(() => setShowSuccess(false), 3000);
    }
  }, [location, navigate]);

  useEffect(() => {
    const fetchClassRooms = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Authentication token not found.");
          setClassRooms([]);
          return;
        }

        const response = await axios.get(
          `http://localhost/api/v1/class_room/list?page=${currentPage}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClassRooms(response.data.data); // Adjust based on API response
        setTotalPages(response.data.totalPages); // Adjust based on API response
      } catch (err) {
        setError("Failed to fetch classroom data.");
      } finally {
        setLoading(false);
      }
    };

    fetchClassRooms();
  }, [currentPage, limit]);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleCreateClassRoom = () => {
    navigate("/classroom/create"); // Navigate to create page
  };

  const handleEditClassRoom = (id, currentName) => {
    setEditClassRoomId(id);
    setEditClassRoomName(currentName);
    setIsEditPopupOpen(true);
    setEditError(null);
  };

  const closeEditPopup = () => {
    setIsEditPopupOpen(false);
    setEditClassRoomId(null);
    setEditClassRoomName("");
    setEditError(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setEditError("Authentication token not found.");
        setEditLoading(false);
        return;
      }

      const response = await axios.patch(
        `http://localhost/api/v1/class_room/edit/${editClassRoomId}`,
        { name: editClassRoomName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 204) {
        // Update the classroom list with the new name
        setClassRooms((prevClassRooms) =>
          prevClassRooms.map((classRoom) =>
            classRoom.id === editClassRoomId
              ? { ...classRoom, name: editClassRoomName }
              : classRoom
          )
        );
        setSuccessMessage("Classroom updated successfully.");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        closeEditPopup();
      } else {
        setEditError("Failed to update classroom.");
      }
    } catch (err) {
      setEditError(
        err.response?.data?.message || "An error occurred while updating."
      );
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  if (error) {
    return <p className="error">Error: {error}</p>;
  }

  return (
    <div className="container">
      <p className="myParagraphClass">Classroom List</p>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Edit Classroom</th> {/* New Header */}
          </tr>
        </thead>
        <tbody>
          {classRooms.length === 0 ? (
            <tr>
              <td colSpan="5">No classrooms found.</td> {/* Updated colspan */}
            </tr>
          ) : (
            classRooms.map((classRoom, index) => (
              <tr key={classRoom.id}>
                <td>{(currentPage - 1) * limit + index + 1}</td>
                <td style={{ fontWeight: "bold" }}>{classRoom.name}</td>
                <td>{classRoom.createdAt.date.slice(0, 10)}</td>
                <td>{classRoom.createdAt.date.slice(0, 10)}</td>
                <td>
                  <button
                    className="VerifyButton"
                    onClick={() =>
                      handleEditClassRoom(classRoom.id, classRoom.name)
                    }
                  >
                    Edit
                  </button>
                </td>
                {/* Add more data fields as needed */}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={handlePrev} disabled={currentPage === 1}>
          Previous
        </button>
        {/* Render page numbers */}
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={page === currentPage ? "active" : ""}
            >
              {page}
            </button>
          )
        )}
        <button onClick={handleNext} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
      {/* Create Classroom Button */}
      <button
        className="create-classroom-button"
        onClick={handleCreateClassRoom}
      >
        Create a Classroom
      </button>

      {/* Edit Classroom Popup */}
      {isEditPopupOpen && (
        <div className="edit-popup-overlay">
          <div className="edit-popup">
            <h2>Edit Classroom: {editClassRoomName}</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label htmlFor="editName">Classroom Name:</label>
                <input
                  type="text"
                  id="editName"
                  value={editClassRoomName}
                  onChange={(e) => setEditClassRoomName(e.target.value)}
                  required
                  placeholder="Enter new classroom name"
                />
              </div>
              {editError && <p className="error">{editError}</p>}
              <div className="popup-buttons">
                <button
                  type="submit"
                  className="VerifyButton"
                  disabled={editLoading}
                >
                  {editLoading ? "Updating..." : "Update"}
                </button>
                <button
                  type="button"
                  className="DeactivateButton"
                  onClick={closeEditPopup}
                  disabled={editLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccess && (
        <div className="success-notification">
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
}

export default ClassRoom;
