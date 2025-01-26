import React, { useEffect, useState } from "react";
import "./ClassRoom.css";
import { useNavigate, useLocation } from "react-router-dom";
import apiConfig from "../../config";

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
  const [studentSearchPhrase, setStudentSearchPhrase] = useState(""); // New state for search phrase

  // States for Delete Student Modal
  const [isDeleteStudentModalOpen, setIsDeleteStudentModalOpen] =
    useState(false);
  const [deleteStudentClassRoomId, setDeleteStudentClassRoomId] =
    useState(null);
  const [studentIdToDelete, setStudentIdToDelete] = useState("");
  const [deleteStudentLoading, setDeleteStudentLoading] = useState(false);
  const [deleteStudentError, setDeleteStudentError] = useState(null);

  // State and Handlers for Details Popup
  const [isDetailsPopupOpen, setIsDetailsPopupOpen] = useState(false);
  const [detailsClassRoom, setDetailsClassRoom] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const [studentListLoading, setStudentListLoading] = useState(false);
  const [studentListError, setStudentListError] = useState(null);
  const [searchPhrase, setSearchPhrase] = useState("");

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
      // console.log("Fetching classrooms...");
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
        // console.log("Classrooms fetched successfully:", data);
        setClassRooms(data.data);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Error fetching classrooms:", err);
        setError("An error occurred while fetching classrooms.");
      } finally {
        setLoading(false);
        // console.log("Classrooms loading finished.");
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
        setEditError(errorData.errors.validation);
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

  const fetchClassRoomDetails = async (classRoomId) => {
    setDetailsLoading(true);
    setStudentListLoading(true);
    setDetailsError(null);
    setStudentListError(null);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setDetailsError("Authentication token not found.");
        setDetailsLoading(false);
        setStudentListLoading(false);
        return;
      }

      // Pobierz dane klasy
      const classroomResponse = await fetch(
        `${apiConfig.apiUrl}/api/v1/class_rooms/list?page=1&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!classroomResponse.ok) {
        const message = `Failed to fetch classroom list. Status: ${classroomResponse.status}`;
        setDetailsError(message);
        setDetailsLoading(false);
        setStudentListLoading(false);
        return;
      }

      const classroomData = await classroomResponse.json();
      const classroomDetails = classroomData.data.find(
        (classroom) => classroom.id === classRoomId
      );

      if (classroomDetails) {
        setDetailsClassRoom(classroomDetails);
      } else {
        setDetailsError("Classroom details not found.");
        setDetailsClassRoom(null);
        setStudentListLoading(false);
        return;
      }

      // Pobierz listę studentów
      const studentResponse = await fetch(
        `${apiConfig.apiUrl}/api/v1/class_room/${classRoomId}/students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!studentResponse.ok) {
        const message = `Failed to fetch student list. Status: ${studentResponse.status}`;
        setStudentListError(message);
        setStudentListLoading(false);
        setDetailsLoading(false);
        return;
      }

      const studentData = await studentResponse.json();
      const uniqueStudents = studentData.filter(
        (student, index, self) =>
          index === self.findIndex((t) => t.email === student.email)
      );

      setStudentList(uniqueStudents);
    } catch (err) {
      console.error("Error fetching classroom details:", err);
      setDetailsError("Failed to load classroom details.");
      setStudentListError("Failed to load student list.");
    } finally {
      setDetailsLoading(false);
      setStudentListLoading(false);
    }
  };
  // Function to fetch student list (extracted from handleOpenAddStudentModal)
  const fetchStudentList = async () => {
    setStudentListLoading(true);
    setStudentListError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setStudentListError("Authentication token not found.");
        setStudentListLoading(false);
        return;
      }

      const apiUrlWithCacheBust = `${apiConfig.apiUrl}/api/v1/students/list?searchPhrase=${studentSearchPhrase}&fetchAll=0`;
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
      setStudentList(data.data);
    } catch (err) {
      console.error("Error fetching student list:", err);
      setStudentListError("Failed to load student list.");
    } finally {
      setStudentListLoading(false);
    }
  };

  // Handlers for Add Student Modal
  const handleOpenAddStudentModal = async (classRoomId) => {
    closeDetailsPopup();
    setAddStudentClassRoomId(classRoomId);
    setStudentIdToAdd("");
    setAddStudentError(null);
    setIsAddStudentModalOpen(true);
    setStudentList([]);
    setStudentListError(null);
    setStudentListLoading(true);
    fetchStudentList(); // Fetch students when modal opens
  };

  useEffect(() => {
    // Fetch students whenever search phrase changes
    if (isAddStudentModalOpen) {
      fetchStudentList();
    }
  }, [studentSearchPhrase, isAddStudentModalOpen]); // Depend on studentSearchPhrase and isAddStudentModalOpen

  const handleCloseAddStudentModal = () => {
    // console.log("handleCloseAddStudentModal called.");
    setIsAddStudentModalOpen(false);
    setAddStudentClassRoomId(null);
    setStudentIdToAdd("");
    setAddStudentError(null);
    setStudentList([]);
    setStudentListError(null);
    setStudentSearchPhrase(""); // Clear search phrase on modal close
  };

  const handleAddStudentSubmit = async () => {
    // console.log("handleAddStudentSubmit called.");
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
      // console.log(studentIdToAdd);

      if (response.status === 200) {
        // console.log("Student added to classroom successfully.");
        setSuccessMessage("Student added to classroom successfully.");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        handleCloseAddStudentModal();
        window.location.reload();
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
      // console.log("handleAddStudentSubmit finished.");
    }
  };

  // Handlers for Delete Student Modal
  const handleOpenDeleteStudentModal = async (classRoomId) => {
    // console.log(
    //   "handleOpenDeleteStudentModal called for classroom ID:",
    //   classRoomId
    // );
    setDeleteStudentClassRoomId(classRoomId);
    setStudentIdToDelete("");
    setDeleteStudentError(null);
    setIsDeleteStudentModalOpen(true);
  };

  const handleCloseDeleteStudentModal = () => {
    // console.log("handleCloseDeleteStudentModal called.");
    setIsDeleteStudentModalOpen(false);
    setDeleteStudentClassRoomId(null);
    setStudentIdToDelete("");
    setDeleteStudentError(null);
  };

  const handleRemoveStudentFromClassRoom = async (studentId) => {
    const response = await fetch(
      `${apiConfig.apiUrl}/api/v1/student/${studentId}/remove_class_room`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 204) {
      setSuccessMessage("Student removed from classroom successfully.");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      // window.location.reload();
    } else {
      const errorData = response.json();
      console.error("Failed to remove student from classroom.", errorData);
      setDeleteStudentError(
        errorData.message || "Failed to remove student from classroom."
      );
    }
    await fetchClassRoomDetails(detailsClassRoom.id);
  };

  const handleDeleteStudentSubmit = async () => {
    // console.log("handleDeleteStudentSubmit called.");
    setDeleteStudentLoading(true);
    setDeleteStudentError(null);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setDeleteStudentError("Authentication token not found.");
        setDeleteStudentLoading(false);
        return;
      }
      // console.log(studentIdToDelete);
      const selectedStudent = studentList.find(
        (student) =>
          `${student.firstName} ${student.lastName} (${student.email})` ===
          studentIdToDelete
      );
      // console.log("Selected student:", selectedStudent.studentId);
      // console.log(selectedStudent);
      if (!selectedStudent) {
        setDeleteStudentError("Invalid student selected.");
        setDeleteStudentLoading(false);
        return;
      }

      const response = await fetch(
        `${apiConfig.apiUrl}/api/v1/student/${selectedStudent.studentId}/remove_class_room`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 204) {
        // console.log("Student removed from classroom successfully.");
        setSuccessMessage("Student removed from classroom successfully.");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        handleCloseDeleteStudentModal();
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("Failed to remove student from classroom.", errorData);
        setDeleteStudentError(
          errorData.message || "Failed to remove student from classroom."
        );
      }
    } catch (err) {
      console.error("Error removing student from classroom:", err);
      setDeleteStudentError(
        "An error occurred while removing student from classroom."
      );
    } finally {
      setDeleteStudentLoading(false);
      console.log("handleDeleteStudentSubmit finished.");
    }
  };

  const handleGoToGrades = (studentId) => {
    console.log(studentId);
    if (studentId) {
      navigate(`/student/${studentId}/grades`);
    }
    closeDetailsPopup();
  };

  // State and Handlers for Details Popup
  const handleDetailsClassRoom = async (id) => {
    // console.log("handleDetailsClassRoom called for classroom ID:", id);
    setDetailsClassRoom(null);
    setDetailsError(null);
    setIsDetailsPopupOpen(true);
    setDetailsLoading(true);
    setStudentList([]); // Clear student list when opening details
    setStudentListError(null);
    setStudentListLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setDetailsError("Authentication token not found.");
        setDetailsLoading(false);
        setStudentListLoading(false);
        return;
      }

      const classroomResponse = await fetch(
        `${apiConfig.apiUrl}/api/v1/class_rooms/list?page=1&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!classroomResponse.ok) {
        const message = `Failed to fetch classroom list. Status: ${classroomResponse.status}`;
        setDetailsError(message);
        setDetailsLoading(false);
        setStudentListLoading(false);
        return;
      }

      const classroomData = await classroomResponse.json();
      // console.log(
      //   "Classrooms fetched for details successfully:",
      //   classroomData.data
      // );
      const classroomDetails = classroomData.data.find(
        (classroom) => classroom.id === id
      );

      if (classroomDetails) {
        // console.log("Classroom details found:", classroomDetails);
        setDetailsClassRoom(classroomDetails);
      } else {
        setDetailsError("Classroom details not found.");
        setDetailsClassRoom(null);
        setStudentListLoading(false);
        return;
      }

      const studentResponse = await fetch(
        `${apiConfig.apiUrl}/api/v1/class_room/${id}/students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!studentResponse.ok) {
        const message = `Failed to fetch student list. Status: ${studentResponse.status}`;
        setStudentListError(message);
        setStudentListLoading(false);
        setDetailsLoading(false);
        return;
      }

      const studentData = await studentResponse.json();
      // console.log(
      //   "Student list fetched successfully (with potential duplicates):",
      //   studentData
      // );

      // Filtrowanie duplikatów po emailu
      const uniqueStudents = studentData.filter(
        (student, index, self) =>
          index === self.findIndex((t) => t.email === student.email)
      );
      // console.log(
      //   "Student list after removing duplicates (by email):",
      //   uniqueStudents
      // );

      setStudentList(uniqueStudents);
    } catch (err) {
      console.error("Error fetching classroom details:", err);
      setDetailsError("Failed to load classroom details.");
      setStudentListError("Failed to load student list.");
    } finally {
      setDetailsLoading(false);
      setStudentListLoading(false);
      // console.log("Classroom details loading finished.");
    }
  };

  const closeDetailsPopup = () => {
    setIsDetailsPopupOpen(false);
    setDetailsClassRoom(null);
    setDetailsError(null);
    setStudentList([]);
    setStudentListError(null);
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
                <td>{classRoom.createdAt}</td>
                <td>{classRoom.updatedAt ? classRoom.updatedAt : "-"}</td>
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
                    className="AddButton"
                    onClick={() => handleDetailsClassRoom(classRoom.id)}
                    style={{ marginLeft: "10px" }}
                  >
                    Details
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
            <h3>Edit Classroom</h3>

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
              <div className="popup-buttons1">
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
            <h3>Delete Classroom</h3>
            <p>
              Are you sure you want to delete the classroom "
              <strong>{deleteClassRoomName}</strong>"?
            </p>
            {deleteError && <p className="error">{deleteError}</p>}
            <div className="popup-buttons1">
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
                style={{ backgroundColor: "#e54646", marginLeft: "20px" }}
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
            <h3>Add student to classroom</h3>
            {studentListLoading && (
              <p className="loading">Loading students...</p>
            )}
            {studentListError && <p className="error">{studentListError}</p>}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddStudentSubmit();
              }}
            >
              <div className="form-group">
                <label htmlFor="studentSearch">Search Student:</label>
                <input
                  type="text"
                  id="studentSearch"
                  placeholder="Enter student name or email"
                  value={studentSearchPhrase}
                  onChange={(e) => setStudentSearchPhrase(e.target.value)}
                />
              </div>
              {studentList.length > 0 ? (
                <div className="student-list">
                  {" "}
                  {/* Display student list */}
                  {studentList.map((student) => (
                    <div
                      key={student.id}
                      className="student-item"
                      onClick={() => setStudentIdToAdd(student.id)} // Select student by clicking
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        cursor: "pointer",
                        backgroundColor:
                          studentIdToAdd === student.id ? "lightgray" : "white", // Highlight selected student
                      }}
                    >
                      {`${student.firstName} ${student.lastName} (${student.email})`}
                    </div>
                  ))}
                </div>
              ) : (
                !studentListLoading &&
                studentSearchPhrase && <p>No students found.</p> // Show "No students found" only when searched and no results
              )}
              {addStudentError && <p className="error">{addStudentError}</p>}
              <div className="popup-buttons1" style={{ textAlign: "center" }}>
                <button
                  type="submit"
                  className="VerifyButton"
                  disabled={addStudentLoading}
                  style={{ marginRight: "20px" }}
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
          </div>
        </div>
      )}

      {/* Delete Student Modal */}
      {isDeleteStudentModalOpen && (
        <div className="add-student-modal-overlay">
          <div className="add-student-modal">
            <h3>Remove Student from Classroom</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleDeleteStudentSubmit();
              }}
            >
              <div className="form-group">
                <label htmlFor="studentId">Select Student:</label>
                <select
                  id="studentId"
                  value={studentIdToDelete}
                  onClick={(e) => setStudentIdToDelete(e.target.value)}
                  required
                >
                  <option value="">-- Select a student --</option>
                  {studentList.map((student) => {
                    // console.log("Rendering student in dropdown:", student);

                    return (
                      <option
                        key={student.email}
                        value={`${student.firstName} ${student.lastName} (${student.email})`}
                      >
                        {`${student.firstName} ${student.lastName} (${student.email})`}
                      </option>
                    );
                  })}
                </select>
              </div>
              {deleteStudentError && (
                <p className="error">{deleteStudentError}</p>
              )}
              <div className="popup-buttons1">
                <button
                  type="submit"
                  className="DeactivateButton"
                  disabled={deleteStudentLoading}
                >
                  {deleteStudentLoading ? "Removing..." : "Remove Student"}
                </button>
                <button
                  type="button"
                  className="VerifyButton"
                  onClick={handleCloseDeleteStudentModal}
                  disabled={deleteStudentLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Classroom Popup */}
      {isDetailsPopupOpen && (
        <div className="edit-popup-overlay">
          <div className="edit-popup">
            {detailsLoading && (
              <p className="loading">Loading classroom details...</p>
            )}
            {detailsError && <p className="error">{detailsError}</p>}
            {detailsClassRoom ? (
              <>
                <h3>Details for Classroom: {detailsClassRoom.name}</h3>
                <h2
                  style={{
                    textAlign: "left",
                    marginLeft: "0px",
                    fontSize: "1.5rem",
                  }}
                >
                  Classroom students list:{" "}
                </h2>
                {studentListLoading ? (
                  <p className="loading">Loading students...</p>
                ) : studentListError ? (
                  <p className="error">{studentListError}</p>
                ) : studentList.length > 0 ? (
                  <table className="table" style={{ margin: "0 auto" }}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Action</th>
                        {/* <th>Email</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {studentList.map((student) => (
                        <tr key={student.studentId}>
                          <td>{student.firstName + " " + student.lastName} </td>
                          {/* <td>{student.lastName}</td> */}
                          <td>{student.email}</td>
                          <td>
                            <button
                              style={{
                                backgroundColor: "#dc3545",
                                fontWeight: "700",
                              }}
                              onClick={() =>
                                handleRemoveStudentFromClassRoom(
                                  student.studentId
                                )
                              }
                            >
                              Remove student from classroom
                            </button>
                            <button
                              className="DeactivateButton"
                              onClick={() =>
                                handleGoToGrades(student.studentId)
                              }
                              style={{
                                width: "auto",
                                fontSize: "18px",
                                height: "47px",
                                backgroundColor: "lightblue",
                              }}
                            >
                              Display students grade
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tbody></tbody>
                  </table>
                ) : (
                  <p>No students found in this classroom.</p>
                )}
                <div
                  className="popup-buttons5"
                  style={{ flexDirection: "column" }}
                >
                  <button
                    className="DeactivateButton"
                    style={{
                      backgroundColor: "#28a745",
                      width: "160px",

                      margin: "0 auto",
                      marginBottom: "10px",
                    }}
                    onClick={() =>
                      handleOpenAddStudentModal(detailsClassRoom.id)
                    }
                  >
                    Add student
                  </button>
                  {/* <button
                    className="DeactivateButton"
                    style={{
                      backgroundColor: "#ffc107",
                      width: "auto",
                      height: "auto",
                      marginBottom: "10px",
                    }}
                    onClick={() =>
                      handleOpenDeleteStudentModal(detailsClassRoom.id)
                    }
                  >
                    Remove student
                  </button> */}
                  <button
                    className="DeactivateButton"
                    style={{
                      backgroundColor: "#dc3545",
                      width: "160px",
                      height: "auto",
                      margin: "0 auto",
                      marginBottom: "10px",
                    }}
                    onClick={() =>
                      handleDeleteClassRoom(
                        detailsClassRoom.id,
                        detailsClassRoom.name
                      )
                    }
                  >
                    Delete classroom
                  </button>
                </div>
                <div className="popup-buttons3">
                  <button
                    type="button"
                    className="VerifyButton"
                    onClick={closeDetailsPopup}
                    disabled={detailsLoading}
                  >
                    Close
                  </button>
                </div>
              </>
            ) : null}
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
