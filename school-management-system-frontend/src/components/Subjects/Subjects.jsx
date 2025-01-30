import React, { useContext, useEffect, useState } from "react";
import "./Subjects.css";
import { useNavigate, useLocation } from "react-router-dom";
import apiConfig from "../../config";
import TeacherSearchInput from "./TeacherSearchInput";
import { AuthContext } from "../../contexts/AuthContext";

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(15);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // States for Edit Popup
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [editSubjectId, setEditSubjectId] = useState(null);
  const [editSubjectName, setEditSubjectName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTeacherId, setEditTeacherId] = useState(""); // For selected teacher in edit
  const [editTeacherName, setEditTeacherName] = useState(""); // For displaying selected teacher name
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [searchPhrase, setSearchPhrase] = useState("");

  // State for teachers list for Edit Popup
  const [teachers, setTeachers] = useState([]);
  // const [teachersLoading, setTeachersLoading] = useState(false);
  // const [teachersError, setTeachersError] = useState(null);

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
  const [expandedDescription, setExpandedDescription] = useState(null);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);

  const location = useLocation();

  const isAdmin =
    user &&
    user.roles &&
    user.roles.some((role) => role.toUpperCase() === "ROLE_ADMIN");

  const isTeacher =
    user &&
    user.roles &&
    user.roles.some((role) => role.toUpperCase() === "ROLE_TEACHER");

  useEffect(() => {
    if (location.state && location.state.successMessage) {
      setSuccessMessage(location.state.successMessage);
      setShowSuccess(true);
      navigate(location.pathname, { replace: true, state: {} });
      setTimeout(() => setShowSuccess(false), 3000);
    }
  }, [location, navigate]);

  const fetchSubjects = async (page) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication token not found.");
        return;
      }
      let url;
      if (isAdmin) {
        url = `${apiConfig.apiUrl}/api/v1/subjects/list?page=${page}&limit=${limit}`;
      } else if (isTeacher) {
        url = `${apiConfig.apiUrl}/api/v1/teacher/my_subjects`;
      }
      console.log(url);

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          setError("You are not authorized to access this page.");
          navigate("/dashboard");
        } else {
          const errorData = await response.json(); // Get potential error message from the server
          setError(errorData.message || "Failed to fetch subjects.");
        }
        return;
      }

      const data = await response.json();
      // console.log(data);
      setSubjects(Object.values(data)); // This will convert your response to an array of subjects. Important because data is an object, not an array.

      // Calculate totalPages based on the length of the subjects array, since your API doesn't provide a totalCount
      setTotalPages(Math.ceil(Object.keys(data).length / limit));
    } catch (err) {
      console.error("Error fetching subjects:", err);
      setError("An error occurred while fetching subjects.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSubjects(currentPage);
  }, [currentPage, navigate]);

  // const goToPage = (pageNumber) => {
  //   if (pageNumber < 1 || pageNumber > totalPages) return;
  //   setCurrentPage(pageNumber);
  // };

  // // Function to go to the previous page
  // const prevPage = () => {
  //   setCurrentPage((prev) => Math.max(prev - 1, 1));
  // };

  // // Function to go to the next page
  // const nextPage = () => {
  //   setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  // };

  const handleCreateSubject = () => {
    navigate("/subject/create");
  };

  // const fetchTeachers = async () => {
  //   setTeachersLoading(true);
  //   setTeachersError(null);
  //   try {
  //     const token = localStorage.getItem("authToken");
  //     if (!token) {
  //       setTeachersError("Authentication token not found.");
  //       setTeachers([]);
  //       return;
  //     }

  //     const response = await fetch(`${apiConfig.apiUrl}/api/v1/teachers/list`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (!response.ok) {
  //       const message = `Failed to fetch teachers. Status: ${response.status}`;
  //       setTeachersError(message);
  //       setTeachers([]);
  //       return;
  //     }

  //     const data = await response.json();
  //     setTeachers(data.data);
  //   } catch (err) {
  //     setTeachersError("An error occurred while fetching teachers.");
  //     setTeachers([]);
  //   } finally {
  //     setTeachersLoading(false);
  //   }
  // };

  const handleEditSubject = async (
    id,
    currentName,
    currentDescription,
    currentTeacher
  ) => {
    setEditSubjectId(id);
    setEditSubjectName(currentName);
    setEditDescription(currentDescription);
    setEditTeacherId(currentTeacher?.teacherId || ""); // Set current teacher id or empty if no teacher
    setEditTeacherName(
      currentTeacher
        ? `${currentTeacher.firstName} ${currentTeacher.lastName}`
        : ""
    );
    setSearchPhrase(
      currentTeacher
        ? `${currentTeacher.firstName} ${currentTeacher.lastName}`
        : ""
    );

    setIsEditPopupOpen(true);
    setEditError(null);
    // await fetchTeachers(); // Fetch teachers when edit popup is opened
  };

  const closeEditPopup = () => {
    setIsEditPopupOpen(false);
    setEditSubjectId(null);
    setEditSubjectName("");
    setEditDescription("");
    setEditTeacherId("");
    setEditError(null);
    setTeachers([]); // Clear teachers on popup close
  };

  // const handleEditSubmit = async (e) => {
  //   e.preventDefault();
  //   setEditLoading(true);
  //   setEditError(null);

  //   try {
  //     const token = localStorage.getItem("authToken");
  //     if (!token) {
  //       setEditError("Authentication token not found.");
  //       setEditLoading(false);
  //       return;
  //     }

  //     const response = await fetch(
  //       `${apiConfig.apiUrl}/api/v1/subject/${editSubjectId}/edit`,
  //       {
  //         method: "PATCH",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           teacherId: editTeacherId || null, // Send null if no teacher selected
  //           name: editSubjectName,
  //           description: editDescription,
  //         }),
  //       }
  //     );

  //     if (response.status === 204) {
  //       setSubjects((prevSubjects) =>
  //         prevSubjects.map((subject) =>
  //           subject.id === editSubjectId
  //             ? {
  //                 ...subject,
  //                 teacher:
  //                   teachers.find(
  //                     (teacher) => teacher.teacherId === editTeacherId
  //                   ) || null, // Update teacher object
  //                 name: editSubjectName,
  //                 description: editDescription,
  //               }
  //             : subject
  //         )
  //       );
  //       setSuccessMessage("Subject updated successfully.");
  //       setShowSuccess(true);
  //       setTimeout(() => setShowSuccess(false), 3000);
  //       closeEditPopup();
  //       fetchSubjects(); // Refetch to update teacher name immediately
  //     } else {
  //       const errorData = await response.json();
  //       setEditError(errorData.message || "Failed to update subject.");
  //     }
  //   } catch (err) {
  //     setEditError("An error occurred while updating.");
  //   } finally {
  //     setEditLoading(false);
  //   }
  // };

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

  // const handleOpenAssignPopup = async (id) => {
  //   setAssignSubjectId(id);
  //   setSelectedClassroomId("");
  //   await fetchClassrooms();

  //   const subject = subjects.find((subj) => subj.id === id);
  //   if (subject) {
  //     const assignedClassroomIds = subject.classRooms
  //       ? subject.classRooms.map((cr) => cr.id)
  //       : [];
  //     setAssignClassrooms(
  //       classrooms.filter((cr) => !assignedClassroomIds.includes(cr.id))
  //     );
  //   } else {
  //     setAssignClassrooms([]);
  //   }

  //   setIsAssignPopupOpen(true);
  //   setAssignError(null);
  // };

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
  // const handleOpenUnassignPopup = (id) => {
  //   setUnassignSubjectId(id);
  //   setSelectedUnassignClassroomId("");

  //   // Filter and set unassignClassrooms based on the subject's classRooms
  //   const subject = subjects.find((subj) => subj.id === id);
  //   if (subject) {
  //     setUnassignClassrooms(subject.classRooms || []);
  //   } else {
  //     setUnassignClassrooms([]);
  //   }

  //   setIsUnassignPopupOpen(true);
  //   setUnassignError(null);
  // };

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
      {isAdmin && <p className="myParagraphClass">Subjects list</p>}
      {isTeacher && <p className="myParagraphClass">My subjects</p>}
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            {isAdmin && <th>Teacher</th>}

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
                <td>
                  {subject.description && subject.description.length > 30 ? (
                    <>
                      {subject.description.substring(0, 30)}...
                      <span
                        style={{
                          color: "blue",
                          cursor: "pointer",
                          marginLeft: "5px",
                          textDecoration: "underline",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedDescription(subject.description);
                          setIsDescriptionModalOpen(true);
                        }}
                      >
                        [expand]
                      </span>
                    </>
                  ) : (
                    subject.description
                  )}
                </td>
                {isAdmin && (
                  <td>
                    {subject.teacher
                      ? `${subject.teacher.firstName} ${subject.teacher.lastName}`
                      : "Me"}
                  </td>
                )}

                <td>
                  {isAdmin ? (
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
                      {subject.classRooms && subject.classRooms.length > 0
                        ? (() => {
                            const validClassrooms = subject.classRooms.filter(
                              (classroom) => classroom && classroom.name
                            );
                            return validClassrooms.length > 0
                              ? validClassrooms
                                  .map((classroom) => classroom.name)
                                  .join(", ")
                              : "N/A";
                          })()
                        : "N/A"}
                    </span>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "5px",
                      }}
                    >
                      {subject.classRooms && subject.classRooms.length > 0 ? (
                        subject.classRooms
                          .filter((classroom) => classroom && classroom.name)
                          .map((classroom) => (
                            <span
                              key={classroom.id}
                              style={{
                                backgroundColor: "#2F4F4F",
                                padding: "5px",
                                borderRadius: "5px",
                                cursor: "pointer",
                                color: "white",
                              }}
                              onClick={() => {
                                navigate(`/classroom/${classroom.id}/students`);
                              }}
                            >
                              {classroom.name}
                            </span>
                          ))
                      ) : (
                        <span>N/A</span>
                      )}
                    </div>
                  )}
                </td>
                <td>
                  <button
                    className="VerifyButton"
                    onClick={() =>
                      handleEditSubject(
                        subject.id,
                        subject.name,
                        subject.description,
                        subject.teacher // Pass current teacher data
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
                </td>
              </tr>
            ))
          )}
          {isAdmin && (
            <tr>
              <td colSpan="4">
                <button
                  className="create-classroom-button"
                  onClick={handleCreateSubject}
                  style={{ width: "131% ", backgroundColor: "#4f46e5" }}
                >
                  Create a subject
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Pagination Controls */}
      {/* <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={page === currentPage ? "active" : ""}
            >
              {page}
            </button>
          )
        )}
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div> */}

      {/* Edit Subject Popup */}
      {isEditPopupOpen && (
        <div className="edit-popup-overlay">
          <div className="edit-popup">
            <h3>Edit subject</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setEditLoading(true);
                setEditError(null);
                try {
                  const token = localStorage.getItem("authToken");
                  if (!token) {
                    setEditError("Authentication token not found.");
                    return;
                  }
                  const response = await fetch(
                    `${apiConfig.apiUrl}/api/v1/subject/${editSubjectId}/edit`,
                    {
                      method: "PATCH",
                      headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        name: editSubjectName,
                        description: editDescription,
                        teacherId: editTeacherId,
                      }),
                    }
                  );
                  if (response.ok) {
                    setIsEditPopupOpen(false);
                    setSuccessMessage("Subject updated successfully.");
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 3000);
                    fetchSubjects();
                  } else {
                    const errorData = await response.json();
                    setEditError(
                      errorData.message || "Failed to update subject."
                    );
                  }
                } catch (err) {
                  setEditError("An error occurred while updating.");
                } finally {
                  setEditLoading(false);
                }
              }}
            >
              <div className="form-group">
                <label htmlFor="editSubjectName">Subject name:</label>
                <input
                  type="text"
                  id="editSubjectName"
                  value={editSubjectName}
                  onChange={(e) => setEditSubjectName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="editDescription">Description:</label>
                <textarea
                  id="editDescription"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="editTeacher">Teacher:</label>
                <TeacherSearchInput
                  // value={editTeacherId}
                  editTeacherId={editTeacherId}
                  setEditTeacherId={setEditTeacherId}
                  setEditTeacherName={setEditTeacherName} // ADD THIS LINE: Pass setEditTeacherName as a prop
                />
              </div>
              <div
                className="form-group"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "row",
                }}
              >
                <button
                  type="submit"
                  disabled={editLoading}
                  style={{ fontSize: "1rem", fontWeight: "600" }}
                >
                  {editLoading ? "Updating..." : "Update subject"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditPopupOpen(false)}
                  disabled={editLoading}
                  style={{ fontSize: "1rem", fontWeight: "600" }}
                >
                  Cancel
                </button>
              </div>
              {editError && <p className="error">{editError}</p>}
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
              <br />
              <strong style={{ color: "red" }}>WARNING</strong>: This will
              remove all subject-class associations.
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
                style={{
                  marginLeft: "10px",
                  backgroundColor: "rgb(220, 53, 69)",
                }}
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
            className="modal-content1"
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "8px",
            }}
          >
            <h3>Classrooms for {selectedSubject.name}</h3>
            <ul>
              {selectedSubject.classRooms &&
                selectedSubject.classRooms
                  .filter((classroom) => classroom && classroom.name) // Apply the filter here
                  .map((classroom) => (
                    <li key={classroom.id}>
                      {classroom.name}
                      <button
                        style={{ marginLeft: "10px" }}
                        onClick={() => {
                          setSelectedClassroom(classroom);
                          setConfirmationOpen(true);
                        }}
                      >
                        Remove subject from class
                      </button>
                    </li>
                  ))}
            </ul>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: "20px",
              }}
            >
              <button
                onClick={() => setAddClassModalOpen(true)}
                style={{
                  backgroundColor: "#28a745",
                  // marginTop: "20px",
                }}
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
            className="modal-content1"
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column", // Pozostawiamy flex-direction: column
              alignItems: "center", // Dodajemy alignItems: 'center' aby wyśrodkować przyciski
            }}
          >
            <p>
              Are you sure you want to remove {selectedSubject.name} from{" "}
              {selectedClassroom.name}?
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
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
                              (classroom) =>
                                classroom.id !== selectedClassroom.id
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
                style={{ backgroundColor: "#28a745", margin: "0px 5px" }}
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmationOpen(false)}
                style={{ backgroundColor: "#dc3545", margin: "0px 5px" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {isDescriptionModalOpen && (
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
            zIndex: 1003,
          }}
        >
          <div
            className="modal-content1"
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "8px",
              maxWidth: "80%",
              maxHeight: "80%",
              overflow: "auto",
            }}
          >
            <h3>Description</h3>
            <p style={{ whiteSpace: "pre-line" }}>{expandedDescription}</p>
            <button
              class="DeactivateButton"
              onClick={() => setIsDescriptionModalOpen(false)}
              style={{ margin: "0px auto" }}

              // style={{ backgroundColor: "#dc3545", width: "40px" }}
            >
              Close
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
            className="modal-content1"
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "8px",
            }}
          >
            <h3>Add class to {selectedSubject.name}</h3>
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
              style={{
                backgroundColor: "#dc3545",
                margin: "0px auto",
                marginTop: "20px",
              }}
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
