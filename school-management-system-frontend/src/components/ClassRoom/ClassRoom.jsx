import React, { useEffect, useState } from "react";
import "./ClassRoom.css";
import { useNavigate, useLocation } from "react-router-dom";
import apiConfig from "../../config";
import { v4 as uuidv4 } from "uuid";

function ClassRoom() {
  const [classRooms, setClassRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  // States for Edit Popup
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [editClassRoomId, setEditClassRoomId] = useState(null);
  const [editClassRoomName, setEditClassRoomName] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  // States for Delete Popup
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteClassRoomId, setDeleteClassRoomId] = useState(null);
  const [deleteClassRoomName, setDeleteClassRoomName] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // State for Success Notification
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const location = useLocation();

  // States for Add Student Modal
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [addStudentClassRoomId, setAddStudentClassRoomId] = useState(null);
  const [studentIdToAdd, setStudentIdToAdd] = useState("");
  const [addStudentLoading, setAddStudentLoading] = useState(false);
  const [addStudentError, setAddStudentError] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const [studentListLoading, setStudentListLoading] = useState(false);
  const [studentListError, setStudentListError] = useState(null);

  useEffect(() => {
    if (location.state && location.state.successMessage) {
      setSuccessMessage(location.state.successMessage);
      setShowSuccess(true);
      navigate(location.pathname, { replace: true, state: {} });
      setTimeout(() => setShowSuccess(false), 3000);
    }
  }, [location, navigate]);

  useEffect(() => {
    const fetchClassRooms = async () => {
      console.log("Fetching classrooms...");
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Authentication token not found.");
          setClassRooms([]);
          return;
        }

        const response = await fetch(
          `${apiConfig.apiUrl}/api/v1/class_rooms/list?page=${currentPage}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 403) {
            setError("You are not authorized to access this page.");
            navigate("/dashboard");
          } else {
            const message = `Failed to fetch classrooms. Status: ${response.status}`;
            setError(message);
          }
          setClassRooms([]);
          return;
        }

        const data = await response.json();
        console.log("Classrooms fetched successfully:", data);
        setClassRooms(data.data);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Error fetching classrooms:", err);
        setError("An error occurred while fetching classrooms.");
      } finally {
        setLoading(false);
        console.log("Classrooms loading finished.");
      }
    };

    fetchClassRooms();
  }, [currentPage, limit, navigate]);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleCreateClassRoom = () => {
    navigate("/classroom/create");
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

      const response = await fetch(
        `${apiConfig.apiUrl}/api/v1/class_room/edit/${editClassRoomId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: editClassRoomName }),
        }
      );

      if (response.status === 204) {
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
        const errorData = await response.json();
        setEditError(errorData.message || "Failed to update classroom.");
      }
    } catch (err) {
      setEditError("An error occurred while updating.");
    } finally {
      setEditLoading(false);
    }
  };

  // Handlers for Delete Functionality
  const handleDeleteClassRoom = (id, name) => {
    setDeleteClassRoomId(id);
    setDeleteClassRoomName(name);
    setIsDeletePopupOpen(true);
    setDeleteError(null);
  };

  const closeDeletePopup = () => {
    setIsDeletePopupOpen(false);
    setDeleteClassRoomId(null);
    setDeleteClassRoomName("");
    setDeleteError(null);
  };

  const confirmDeleteClassRoom = async () => {
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setDeleteError("Authentication token not found.");
        setDeleteLoading(false);
        return;
      }

      const response = await fetch(
        `${apiConfig.apiUrl}/api/v1/class_room/remove/${deleteClassRoomId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 204 || response.status === 200) {
        setClassRooms((prevClassRooms) =>
          prevClassRooms.filter(
            (classRoom) => classRoom.id !== deleteClassRoomId
          )
        );
        setSuccessMessage("Classroom deleted successfully.");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        closeDeletePopup();
      } else {
        const errorData = await response.json();
        setDeleteError(errorData.message || "Failed to delete classroom.");
      }
    } catch (err) {
      setDeleteError("An error occurred while deleting.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handlers for Add Student Modal
  const handleOpenAddStudentModal = async (classRoomId) => {
    console.log(
      "handleOpenAddStudentModal called for classroom ID:",
      classRoomId
    );
    setAddStudentClassRoomId(classRoomId);
    setStudentIdToAdd("");
    setAddStudentError(null);
    setIsAddStudentModalOpen(true);
    setStudentList([]);
    setStudentListError(null);
    setStudentListLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setStudentListError("Authentication token not found.");
        setStudentListLoading(false);
        return;
      }

      const timestamp = new Date().getTime();
      const apiUrlWithCacheBust = `${apiConfig.apiUrl}/api/v1/students/list?_=${timestamp}`;
      console.log("Fetching student list from:", apiUrlWithCacheBust);

      const response = await fetch(apiUrlWithCacheBust, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const message = `Failed to fetch student list. Status: ${response.status}`;
        setStudentListError(message);
        setStudentListLoading(false);
        return;
      }

      const data = await response.json();
      console.log(
        "Student list fetched successfully (with potential duplicates):",
        data.data
      );

      // Filtrowanie duplikatów po emailu
      const uniqueStudents = data.data.filter(
        (student, index, self) =>
          index === self.findIndex((t) => t.email === student.email)
      );
      console.log(
        "Student list after removing duplicates (by email):",
        uniqueStudents
      );
      setStudentList(uniqueStudents);
    } catch (err) {
      console.error("Error fetching student list:", err);
      setStudentListError("Failed to load student list.");
    } finally {
      setStudentListLoading(false);
      console.log("Student list loading finished.");
    }
  };

  const handleCloseAddStudentModal = () => {
    console.log("handleCloseAddStudentModal called.");
    setIsAddStudentModalOpen(false);
    setAddStudentClassRoomId(null);
    setStudentIdToAdd("");
    setAddStudentError(null);
    setStudentList([]);
    setStudentListError(null);
  };

  const handleAddStudentSubmit = async () => {
    console.log("handleAddStudentSubmit called.");
    setAddStudentLoading(true);
    setAddStudentError(null);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setAddStudentError("Authentication token not found.");
        setAddStudentLoading(false);
        return;
      }

      const response = await fetch(
        `${apiConfig.apiUrl}/api/v1/class_room/${addStudentClassRoomId}/add_student`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ studentId: studentIdToAdd }),
        }
      );

      if (response.status === 200) {
        console.log("Student added to classroom successfully.");
        setSuccessMessage("Student added to classroom successfully.");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        handleCloseAddStudentModal();
      } else {
        const errorData = await response.json();
        console.error("Failed to add student to classroom.", errorData);
        setAddStudentError(
          errorData.message || "Failed to add student to classroom."
        );
      }
    } catch (err) {
      console.error("Error adding student to classroom:", err);
      setAddStudentError(
        "An error occurred while adding student to classroom."
      );
    } finally {
      setAddStudentLoading(false);
      console.log("handleAddStudentSubmit finished.");
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
            <th>Name</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {classRooms.length === 0 ? (
            <tr>
              <td colSpan="6">No classrooms found.</td>
            </tr>
          ) : (
            classRooms.map((classRoom) => (
              <tr key={classRoom.id}>
                <td style={{ fontWeight: "bold" }}>{classRoom.name}</td>
                <td>{classRoom.createdAt.date.slice(5, 19)}</td>
                <td>
                  {classRoom.updatedAt
                    ? classRoom.updatedAt.date.slice(5, 19)
                    : "-"}
                </td>
                <td>
                  <button
                    className="VerifyButton"
                    onClick={() =>
                      handleEditClassRoom(classRoom.id, classRoom.name)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="DeactivateButton"
                    onClick={() =>
                      handleDeleteClassRoom(classRoom.id, classRoom.name)
                    }
                  >
                    Delete
                  </button>
                  <button
                    className="AddButton"
                    onClick={() => handleOpenAddStudentModal(classRoom.id)}
                  >
                    Add Student
                  </button>
                </td>
              </tr>
            ))
          )}
          <tr>
            <td colSpan="4">
              <button
                className="create-classroom-button"
                onClick={handleCreateClassRoom}
              >
                Create a Classroom
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={handlePrev} disabled={currentPage === 1}>
          Previous
        </button>
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

      {/* Edit Classroom Popup */}
      {isEditPopupOpen && (
        <div className="edit-popup-overlay">
          <div className="edit-popup">
            <h2>Edit Classroom</h2>
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

      {/* Delete Classroom Popup */}
      {isDeletePopupOpen && (
        <div className="delete-popup-overlay">
          <div className="delete-popup">
            <h2>Delete Classroom</h2>
            <p>
              Are you sure you want to delete the classroom "
              <strong>{deleteClassRoomName}</strong>"?
            </p>
            {deleteError && <p className="error">{deleteError}</p>}
            <div className="popup-buttons">
              <button
                className="DeactivateButton"
                onClick={confirmDeleteClassRoom}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
              <button
                className="VerifyButton"
                onClick={closeDeletePopup}
                disabled={deleteLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {isAddStudentModalOpen && (
        <div className="add-student-modal-overlay">
          <div className="add-student-modal">
            <h2>Add Student to Classroom</h2>
            {studentListLoading && (
              <p className="loading">Loading students...</p>
            )}
            {studentListError && <p className="error">{studentListError}</p>}
            {studentList.length > 0 ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddStudentSubmit();
                }}
              >
                <div className="form-group">
                  <label htmlFor="studentId">Select Student:</label>
                  <select
                    id="studentId"
                    value={studentIdToAdd}
                    onChange={(e) => setStudentIdToAdd(e.target.value)}
                    required
                  >
                    <option value="">-- Select a student --</option>
                    {studentList.map((student) => (
                      <option key={student.email} value={student.id}>
                        {`${student.firstName} ${student.lastName} (${student.email})`}
                      </option>
                    ))}
                  </select>
                </div>
                {addStudentError && <p className="error">{addStudentError}</p>}
                <div className="popup-buttons">
                  <button
                    type="submit"
                    className="VerifyButton"
                    disabled={addStudentLoading}
                  >
                    {addStudentLoading ? "Adding..." : "Add Student"}
                  </button>
                  <button
                    type="button"
                    className="DeactivateButton"
                    onClick={handleCloseAddStudentModal}
                    disabled={addStudentLoading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              !studentListLoading &&
              !studentListError && <p>No students found.</p>
            )}
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
