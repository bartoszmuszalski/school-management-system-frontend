import React, { useEffect, useState } from "react";
import "./Subjects.css";
import { useNavigate, useLocation } from "react-router-dom";
import apiConfig from "../../config";
import { v4 as uuidv4 } from "uuid";

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  // States for Edit Popup
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [editSubjectId, setEditSubjectId] = useState(null);
  const [editSubjectName, setEditSubjectName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  // States for Delete Popup
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteSubjectId, setDeleteSubjectId] = useState(null);
  const [deleteSubjectName, setDeleteSubjectName] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // State for Success Notification
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // States for Assign Classroom Popup
  const [isAssignPopupOpen, setIsAssignPopupOpen] = useState(false);
  const [assignSubjectId, setAssignSubjectId] = useState(null);
  const [classrooms, setClassrooms] = useState([]);
  const [assignClassrooms, setAssignClassrooms] = useState([]);
  const [selectedClassroomId, setSelectedClassroomId] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState(null);
  const [classroomsLoading, setClassroomsLoading] = useState(false);
  const [classroomsError, setClassroomsError] = useState(null);

  // States for Unassign Classroom Popup
  const [isUnassignPopupOpen, setIsUnassignPopupOpen] = useState(false);
  const [unassignSubjectId, setUnassignSubjectId] = useState(null);
  const [unassignClassrooms, setUnassignClassrooms] = useState([]);
  const [selectedUnassignClassroomId, setSelectedUnassignClassroomId] =
    useState("");
  const [unassignLoading, setUnassignLoading] = useState(false);
  const [unassignError, setUnassignError] = useState(null);

  // States for Classrooms Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [addClassModalOpen, setAddClassModalOpen] = useState(false);
  const [unassignedClasses, setUnassignedClasses] = useState([]);

  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.successMessage) {
      setSuccessMessage(location.state.successMessage);
      setShowSuccess(true);
      navigate(location.pathname, { replace: true, state: {} });
      setTimeout(() => setShowSuccess(false), 3000);
    }
  }, [location, navigate]);

  const fetchSubjects = async () => {
    console.log("Fetching subjects...");
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication token not found.");
        setSubjects([]);
        return;
      }

      const response = await fetch(
        `${apiConfig.apiUrl}/api/v1/subjects/list?page=${currentPage}&limit=${limit}`,
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
          const message = `Failed to fetch subjects. Status: ${response.status}`;
          setError(message);
        }
        setSubjects([]);
        return;
      }

      const data = await response.json();
      console.log("Subjects fetched successfully:", data);
      setSubjects(Object.values(data));
      setTotalPages(Math.ceil(Object.keys(data).length / limit));
    } catch (err) {
      console.error("Error fetching subjects:", err);
      setError("An error occurred while fetching subjects.");
    } finally {
      setLoading(false);
      console.log("Subjects loading finished.");
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [currentPage, limit, navigate]);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleCreateSubject = () => {
    navigate("/subject/create");
  };

  const handleEditSubject = (id, currentName, currentDescription) => {
    setEditSubjectId(id);
    setEditSubjectName(currentName);
    setEditDescription(currentDescription);
    setIsEditPopupOpen(true);
    setEditError(null);
  };

  const closeEditPopup = () => {
    setIsEditPopupOpen(false);
    setEditSubjectId(null);
    setEditSubjectName("");
    setEditDescription("");
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

      // Adjust the API endpoint according to your backend
      const response = await fetch(
        `${apiConfig.apiUrl}/api/v1/subject/${editSubjectId}/edit`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            teacherId: subjects.find((subject) => subject.id === editSubjectId)
              ?.teacher?.id,
            name: editSubjectName,
            description: editDescription,
          }),
        }
      );

      if (response.status === 204) {
        setSubjects((prevSubjects) =>
          prevSubjects.map((subject) =>
            subject.id === editSubjectId
              ? {
                  ...subject,
                  teacherId: subjects.find(
                    (subject) => subject.id === editSubjectId
                  )?.teacher?.id,
                  name: editSubjectName,
                  description: editDescription,
                }
              : subject
          )
        );
        setSuccessMessage("Subject updated successfully.");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        closeEditPopup();
      } else {
        const errorData = await response.json();
        setEditError(errorData.message || "Failed to update subject.");
      }
    } catch (err) {
      setEditError("An error occurred while updating.");
    } finally {
      setEditLoading(false);
    }
  };

  // Handlers for Delete Functionality
  const handleDeleteSubject = (id, name) => {
    setDeleteSubjectId(id);
    setDeleteSubjectName(name);
    setIsDeletePopupOpen(true);
    setDeleteError(null);
  };

  const closeDeletePopup = () => {
    setIsDeletePopupOpen(false);
    setDeleteSubjectId(null);
    setDeleteSubjectName("");
    setDeleteError(null);
  };

  const confirmDeleteSubject = async () => {
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setDeleteError("Authentication token not found.");
        setDeleteLoading(false);
        return;
      }

      // Adjust the API endpoint according to your backend
      const response = await fetch(
        `${apiConfig.apiUrl}/api/v1/subject/${deleteSubjectId}/remove`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 204 || response.status === 200) {
        setSubjects((prevSubjects) =>
          prevSubjects.filter((subject) => subject.id !== deleteSubjectId)
        );
        setSuccessMessage("Subject deleted successfully.");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        closeDeletePopup();
      } else {
        const errorData = await response.json();
        setDeleteError(errorData.message || "Failed to delete subject.");
      }
    } catch (err) {
      setDeleteError("An error occurred while deleting.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handlers for Assign Classroom Functionality
  const fetchClassrooms = async () => {
    setClassroomsLoading(true);
    setClassroomsError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setClassroomsError("Authentication token not found.");
        setClassrooms([]);
        return;
      }

      const response = await fetch(
        `${apiConfig.apiUrl}/api/v1/class_rooms/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const message = `Failed to fetch classrooms. Status: ${response.status}`;
        setClassroomsError(message);
        setClassrooms([]);
        return;
      }

      const data = await response.json();
      setClassrooms(data.data);
    } catch (err) {
      setClassroomsError("An error occurred while fetching classrooms.");
      setClassrooms([]);
    } finally {
      setClassroomsLoading(false);
    }
  };

  const handleOpenAssignPopup = async (id) => {
    setAssignSubjectId(id);
    setSelectedClassroomId("");
    await fetchClassrooms();

    const subject = subjects.find((subj) => subj.id === id);
    if (subject) {
      const assignedClassroomIds = subject.classRooms
        ? subject.classRooms.map((cr) => cr.id)
        : [];
      setAssignClassrooms(
        classrooms.filter((cr) => !assignedClassroomIds.includes(cr.id))
      );
    } else {
      setAssignClassrooms([]);
    }

    setIsAssignPopupOpen(true);
    setAssignError(null);
  };

  const closeAssignPopup = () => {
    setIsAssignPopupOpen(false);
    setAssignSubjectId(null);
    setSelectedClassroomId("");
    setAssignError(null);
  };

  const handleAssignClassroom = async () => {
    setAssignLoading(true);
    setAssignError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setAssignError("Authentication token not found.");
        setAssignLoading(false);
        return;
      }

      const response = await fetch(
        `${apiConfig.apiUrl}/api/v1/subject/${assignSubjectId}/assign`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ classRoomId: selectedClassroomId }),
        }
      );

      if (response.status === 204 || response.status === 200) {
        setSuccessMessage("Classroom assigned successfully.");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        closeAssignPopup();
        await fetchSubjects(); // Refetch subjects after assigning
      } else {
        const errorData = await response.json();
        setAssignError(
          errorData.message || "Subject already assigned to this classroom."
        );
      }
    } catch (err) {
      setAssignError("An error occurred while assigning classroom.");
    } finally {
      setAssignLoading(false);
    }
  };

  // Handlers for Unassign Classroom Functionality
  const handleOpenUnassignPopup = (id) => {
    setUnassignSubjectId(id);
    setSelectedUnassignClassroomId("");

    // Filter and set unassignClassrooms based on the subject's classRooms
    const subject = subjects.find((subj) => subj.id === id);
    if (subject) {
      setUnassignClassrooms(subject.classRooms || []);
    } else {
      setUnassignClassrooms([]);
    }

    setIsUnassignPopupOpen(true);
    setUnassignError(null);
  };

  const closeUnassignPopup = () => {
    setIsUnassignPopupOpen(false);
    setUnassignSubjectId(null);
    setSelectedUnassignClassroomId("");
    setUnassignError(null);
  };

  const handleUnassignClassroom = async () => {
    setUnassignLoading(true);
    setUnassignError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setUnassignError("Authentication token not found.");
        setUnassignLoading(false);
        return;
      }

      const response = await fetch(
        `${apiConfig.apiUrl}/api/v1/subject/${unassignSubjectId}/unassign`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ classRoomId: selectedUnassignClassroomId }),
        }
      );

      if (response.status === 204 || response.status === 200) {
        setSuccessMessage("Classroom unassigned successfully.");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        closeUnassignPopup();
        await fetchSubjects(); // Refetch subjects after unassigning
      } else {
        const errorData = await response.json();
        setUnassignError(errorData.message || "Failed to unassign classroom.");
      }
    } catch (err) {
      setUnassignError("An error occurred while unassigning classroom.");
    } finally {
      setUnassignLoading(false);
    }
  };

  useEffect(() => {
    const fetchUnassignedClasses = async () => {
      if (selectedSubject) {
        try {
          const token = localStorage.getItem("authToken");
          if (!token) {
            setError("Authentication token not found.");
            setUnassignedClasses([]);
            return;
          }
          const response = await fetch(
            `${apiConfig.apiUrl}/api/v1/class_rooms/list?subjectId=${selectedSubject.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setUnassignedClasses(data.data);
          } else {
            console.error("Failed to fetch unassigned classes");
            setUnassignedClasses([]);
          }
        } catch (error) {
          console.error("Error fetching unassigned classes:", error);
          setUnassignedClasses([]);
        }
      }
    };
    fetchUnassignedClasses();
  }, [selectedSubject, addClassModalOpen]);

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  if (error) {
    return <p className="error">Error: {error}</p>;
  }

  return (
    <div className="container">
      <p className="myParagraphClass">Subjects list</p>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Teacher</th>
            <th>Class</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.length === 0 ? (
            <tr>
              <td colSpan="6">No subjects found.</td>
            </tr>
          ) : (
            subjects.map((subject) => (
              <tr key={subject.id}>
                <td style={{ fontWeight: "bold" }}>{subject.name}</td>
                <td>{subject.description}</td>
                <td>
                  {subject.teacher
                    ? `${subject.teacher.firstName} ${subject.teacher.lastName}`
                    : "N/A"}
                </td>
                <td>
                  <span
                    style={{
                      cursor: "pointer",
                      color: "blue",
                      textDecoration: "underline",
                    }}
                    onClick={() => {
                      setSelectedSubject(subject);
                      setModalOpen(true);
                    }}
                  >
                    {subject.classRooms
                      ? subject.classRooms
                          .map((classroom) => classroom.name)
                          .join(", ")
                      : "N/A"}
                  </span>
                </td>
                <td>
                  <button
                    className="VerifyButton"
                    onClick={() =>
                      handleEditSubject(
                        subject.id,
                        subject.name,
                        subject.description
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="DeactivateButton"
                    onClick={() =>
                      handleDeleteSubject(subject.id, subject.name)
                    }
                  >
                    Delete
                  </button>
                  <button
                    className="AddButton"
                    onClick={() => handleOpenAssignPopup(subject.id)}
                  >
                    Assign Classroom
                  </button>
                  <button
                    className="AddButton"
                    onClick={() => handleOpenUnassignPopup(subject.id)}
                  >
                    Unassign Classroom
                  </button>
                </td>
              </tr>
            ))
          )}
          <tr>
            <td colSpan="4">
              <button
                className="create-classroom-button"
                onClick={handleCreateSubject}
              >
                Create a subject
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

      {/* Edit Subject Popup */}
      {isEditPopupOpen && (
        <div className="edit-popup-overlay">
          <div className="edit-popup">
            <h2>Edit Subject</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label htmlFor="editName">Subject Name:</label>
                <input
                  type="text"
                  id="editName"
                  value={editSubjectName}
                  onChange={(e) => setEditSubjectName(e.target.value)}
                  required
                  placeholder="Enter new subject name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="editDescription">Description:</label>
                <input
                  type="text"
                  id="editDescription"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Enter subject description"
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

      {/* Delete Subject Popup */}
      {isDeletePopupOpen && (
        <div className="delete-popup-overlay">
          <div className="delete-popup">
            <h2>Delete Subject</h2>
            <p>
              Are you sure you want to delete the subject "
              <strong>{deleteSubjectName}</strong>"?
            </p>
            {deleteError && <p className="error">{deleteError}</p>}
            <div className="popup-buttons">
              <button
                className="DeactivateButton"
                onClick={confirmDeleteSubject}
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
      {/* Success Notification */}
      {showSuccess && (
        <div className="success-notification">
          <p>{successMessage}</p>
        </div>
      )}
      {/* Assign Classroom Popup */}
      {isAssignPopupOpen && (
        <div className="assign-popup-overlay">
          <div className="assign-popup">
            <h2>Assign Classroom</h2>
            {classroomsLoading ? (
              <p className="loading">Loading classrooms...</p>
            ) : classroomsError ? (
              <p className="error">{classroomsError}</p>
            ) : (
              <div className="form-group">
                <label htmlFor="classroomId">Select Classroom:</label>
                <select
                  id="classroomId"
                  value={selectedClassroomId}
                  onChange={(e) => setSelectedClassroomId(e.target.value)}
                  required
                  className="assign-popup-select"
                >
                  <option value="">-- Select a classroom --</option>
                  {assignClassrooms.map((classroom) => (
                    <option key={classroom.id} value={classroom.id}>
                      {classroom.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {assignError && <p className="error">{assignError}</p>}
            <div className="popup-buttons">
              <button
                className="VerifyButton"
                onClick={handleAssignClassroom}
                disabled={assignLoading}
              >
                {assignLoading ? "Assigning..." : "Assign"}
              </button>
              <button
                className="DeactivateButton"
                onClick={closeAssignPopup}
                disabled={assignLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Unassign Classroom Popup */}
      {isUnassignPopupOpen && (
        <div className="assign-popup-overlay">
          <div className="assign-popup">
            <h2>Unassign Classroom</h2>
            <div className="form-group">
              <label htmlFor="classroomId">Select Classroom:</label>
              <select
                id="classroomId"
                value={selectedUnassignClassroomId}
                onChange={(e) => setSelectedUnassignClassroomId(e.target.value)}
                required
                className="assign-popup-select"
              >
                <option value="">-- Select a classroom --</option>
                {unassignClassrooms.map((classroom) => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name}
                  </option>
                ))}
              </select>
            </div>

            {unassignError && <p className="error">{unassignError}</p>}
            <div className="popup-buttons">
              <button
                className="DeactivateButton"
                onClick={handleUnassignClassroom}
                disabled={unassignLoading}
              >
                {unassignLoading ? "Unassigning..." : "Unassign"}
              </button>
              <button
                className="VerifyButton"
                onClick={closeUnassignPopup}
                disabled={unassignLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {modalOpen && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <h2>Classrooms for {selectedSubject.name}</h2>
            <ul>
              {selectedSubject.classRooms &&
                selectedSubject.classRooms.map((classroom) => (
                  <li key={classroom.id}>
                    {classroom.name}
                    <button
                      style={{ marginLeft: "10px" }}
                      onClick={() => {
                        setSelectedClassroom(classroom);
                        setConfirmationOpen(true);
                      }}
                    >
                      Remove Subject from Class
                    </button>
                  </li>
                ))}
            </ul>
            <button
              onClick={() => setAddClassModalOpen(true)}
              style={{ backgroundColor: "#28a745", marginTop: "20px" }}
            >
              Add subject to class
            </button>
            <button
              onClick={() => setModalOpen(false)}
              style={{ backgroundColor: "#dc3545" }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {confirmationOpen && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1001,
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <p>
              Are you sure you want to remove {selectedSubject.name} from{" "}
              {selectedClassroom.name}?
            </p>
            <button
              onClick={async () => {
                try {
                  const token = localStorage.getItem("authToken");
                  if (!token) {
                    setError("Authentication token not found.");
                    return;
                  }
                  const response = await fetch(
                    `${apiConfig.apiUrl}/api/v1/subject/${selectedSubject.id}/unassign`,
                    {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        classRoomId: selectedClassroom.id,
                      }),
                    }
                  );
                  if (response.ok) {
                    const updatedSubjects = subjects.map((subject) => {
                      if (subject.id === selectedSubject.id) {
                        return {
                          ...subject,
                          classRooms: subject.classRooms.filter(
                            (classroom) => classroom.id !== selectedClassroom.id
                          ),
                        };
                      }
                      return subject;
                    });
                    setSubjects(updatedSubjects);
                    setConfirmationOpen(false);
                    setSuccessMessage("Classroom unassigned successfully.");
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 3000);
                    fetchSubjects();
                  } else {
                    const errorData = await response.json();
                    setError(
                      errorData.message || "Failed to unassign classroom."
                    );
                  }
                } catch (error) {
                  setError("An error occurred while unassigning classroom.");
                }
              }}
              style={{ backgroundColor: "#28a745", margin: "0px auto" }}
            >
              Confirm
            </button>
            <button
              onClick={() => setConfirmationOpen(false)}
              style={{ backgroundColor: "#dc3545", margin: "0px auto" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {addClassModalOpen && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1002,
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <h2>Add Class to {selectedSubject.name}</h2>
            <ul>
              {unassignedClasses &&
                unassignedClasses.map((classroom) => (
                  <li key={classroom.id}>
                    {classroom.name}
                    <button
                      style={{ marginLeft: "10px", backgroundColor: "#28a745" }}
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem("authToken");
                          if (!token) {
                            setError("Authentication token not found.");
                            return;
                          }
                          const response = await fetch(
                            `${apiConfig.apiUrl}/api/v1/subject/${selectedSubject.id}/assign`,
                            {
                              method: "POST",
                              headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                classRoomId: classroom.id,
                              }),
                            }
                          );
                          if (response.ok) {
                            const updatedSubjects = subjects.map((subject) => {
                              if (subject.id === selectedSubject.id) {
                                return {
                                  ...subject,
                                  classRooms: subject.classRooms
                                    ? [...subject.classRooms, classroom]
                                    : [classroom],
                                };
                              }
                              return subject;
                            });
                            setSubjects(updatedSubjects);
                            setAddClassModalOpen(false);
                            setSuccessMessage(
                              "Classroom assigned successfully."
                            );
                            setShowSuccess(true);
                            setTimeout(() => setShowSuccess(false), 3000);
                            fetchSubjects();
                          } else {
                            const errorData = await response.json();
                            setError(
                              errorData.message ||
                                "Subject already assigned to this classroom."
                            );
                          }
                        } catch (error) {
                          setError(
                            "An error occurred while assigning classroom."
                          );
                        }
                      }}
                    >
                      Assign
                    </button>
                  </li>
                ))}
            </ul>
            <button
              onClick={() => setAddClassModalOpen(false)}
              style={{ backgroundColor: "#dc3545" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subjects;
