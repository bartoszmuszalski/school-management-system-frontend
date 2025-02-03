import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiConfig from "../../config";
import "../Subjects/Subjects.css";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";

// Function to determine background color based on grade
const getGradeColor = (grade) => {
  const gradeValue = parseInt(grade, 10);
  if (isNaN(gradeValue)) {
    return "gray";
  }

  switch (gradeValue) {
    case 1:
      return "#DC143C"; // Crimson/Karmazynowy
    case 2:
      return "#FF4500"; // OrangeRed/Pomarańczowy z czerwonym
    case 3:
      return "#FFA500"; // Orange/Pomarańczowy
    case 4:
      return "#88b388"; // LightGreen/Jasnozielony
    case 5:
      return "#008000"; // Green/Zielony
    case 6:
      return "#FFC700"; // Gold/Złoty
    default:
      return "lightgray";
  }
};

function ClassRoomList() {
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { classRoomID } = useParams();
  const navigate = useNavigate();
  const [isAddGradePopupVisible, setIsAddGradePopupVisible] = useState(false);
  const [selectedStudentSubject, setSelectedStudentSubject] = useState(null);
  const [selectedGradeDetails, setSelectedGradeDetails] = useState(null);
  const [isGradeDetailsPopupVisible, setIsGradeDetailsPopupVisible] =
    useState(false);
  const { showNotification } = useNotification();
  const isTeacher = user?.roles?.some(
    (role) => role.toUpperCase() === "ROLE_TEACHER"
  );

  useEffect(() => {
    const fetchClassroomStudents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `${apiConfig.apiUrl}/api/v1/class_room/${classRoomID}/students`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const studentsWithSubjects = await Promise.all(
          response.data.map(async (student) => {
            const gradesResponse = await axios.get(
              `${apiConfig.apiUrl}/api/v1/student/${student.studentId}/grades`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const subjects = Object.values(gradesResponse.data).map(
              (subject) => ({
                ...subject,
                grades: subject.grades || [],
                average: subject.average,
              })
            );

            return {
              ...student,
              subjects,
              fullName: `${student.firstName} ${student.lastName}`,
            };
          })
        );

        setStudents(studentsWithSubjects);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchClassroomStudents();
  }, [classRoomID]);

  const handleOpenAddGrade = (studentId, subjectId) => {
    setSelectedStudentSubject({ studentId, subjectId });
    setIsAddGradePopupVisible(true);
  };

  const handleOpenGradeDetails = (gradeDetails) => {
    setSelectedGradeDetails(gradeDetails);
    setIsGradeDetailsPopupVisible(true);
  };

  const handleCloseAddGrade = () => {
    setIsAddGradePopupVisible(false);
    setSelectedStudentSubject(null);
  };
  const handleCloseGradeDetailsPopup = () => {
    setSelectedGradeDetails(null);
    setIsGradeDetailsPopupVisible(false);
  };

  const refreshData = async () => {
    const fetchClassroomStudents = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `${apiConfig.apiUrl}/api/v1/class_room/${classRoomID}/students`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const studentsWithSubjects = await Promise.all(
          response.data.map(async (student) => {
            const gradesResponse = await axios.get(
              `${apiConfig.apiUrl}/api/v1/student/${student.studentId}/grades`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const subjects = Object.values(gradesResponse.data).map(
              (subject) => ({
                ...subject,
                grades: subject.grades || [],
                average: subject.average,
              })
            );

            return {
              ...student,
              subjects,
              fullName: `${student.firstName} ${student.lastName}`,
            };
          })
        );

        setStudents(studentsWithSubjects);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching data");
      }
    };

    fetchClassroomStudents();
  };

  if (loading) return <p className="loading">Loading students...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="container">
      <p className="myParagraphClass">Students in this classroom</p>
      {students.length === 0 ? (
        <p>No students in this classroom.</p>
      ) : (
        <table className="grades-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Subjects</th>
              <th>Grades</th>
              <th>Average</th>
              {isTeacher && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const subjectCount = student.subjects.length || 1; // Ilość przedmiotów ucznia

              return (
                <React.Fragment key={student.studentId}>
                  {student.subjects.length > 0 ? (
                    student.subjects.map((subject, index) => (
                      <tr key={`${student.studentId}-${subject.subjectId}`}>
                        {/* Pierwsza kolumna "Student" - rowspan tylko dla pierwszego przedmiotu */}
                        {index === 0 && (
                          <td
                            rowSpan={subjectCount}
                            style={{ verticalAlign: "middle" }}
                          >
                            {student.fullName}
                          </td>
                        )}
                        {/* Kolumna "Subjects" */}
                        <td>
                          <p style={{ fontWeight: "bold" }}>
                            {subject.subjectName}
                          </p>
                        </td>
                        {/* Kolumna "Grades" */}
                        <td>
                          <div className="grades-list">
                            {subject.grades && subject.grades.length > 0 ? (
                              subject.grades.map((grade) => (
                                <span
                                  key={grade.id}
                                  className="grade-item"
                                  onClick={() => handleOpenGradeDetails(grade)}
                                  style={{
                                    backgroundColor: getGradeColor(grade.grade),
                                  }}
                                >
                                  {grade.grade}
                                </span>
                              ))
                            ) : (
                              <div className="no-data-message">No grades</div>
                            )}
                          </div>
                        </td>
                        {/* Kolumna "Average" */}
                        <td>{subject.average?.toFixed(2) || "--"}</td>
                        {/* Kolumna "Actions" - przycisk tylko dla danego przedmiotu */}
                        {isTeacher && (
                          <td>
                            <button
                              className="VerifyButton"
                              onClick={() =>
                                handleOpenAddGrade(
                                  student.studentId,
                                  subject.subjectId
                                )
                              }
                            >
                              Add Grade
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr key={student.studentId}>
                      {/* Gdy uczeń nie ma przedmiotów */}
                      <td rowSpan={1}>{student.fullName}</td>
                      <td
                        colSpan={isTeacher ? 4 : 3}
                        className="no-data-message"
                      >
                        No subjects assigned
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      )}

      {isAddGradePopupVisible && (
        <AddGradePopup
          studentId={selectedStudentSubject?.studentId}
          subjectId={selectedStudentSubject?.subjectId}
          onClose={handleCloseAddGrade}
          onGradeAdded={refreshData}
        />
      )}
      {isGradeDetailsPopupVisible && (
        <GradeDetailsPopup
          gradeDetails={selectedGradeDetails}
          onClose={handleCloseGradeDetailsPopup}
          onGradeUpdated={refreshData}
          onGradeDeleted={refreshData}
          showNotification={showNotification}
        />
      )}

      <button
        className="create-classroom-button"
        onClick={() => navigate(-1)}
        style={{}}
      >
        Go back
      </button>
    </div>
  );
}

const GradesDisplay = ({ grades, studentId, subjectId, refreshGradesList }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [gradeDetails, setGradeDetails] = useState(null);
  const [selectedGradeId, setSelectedGradeId] = useState(null);
  const [loadingGradeDetails, setLoadingGradeDetails] = useState(false);
  const [errorGradeDetails, setErrorGradeDetails] = useState(null);
  const handleGradeClick = (gradeId) => {
    setSelectedGradeId(gradeId);
    setIsPopupVisible(true);
    fetchGradeDetails(gradeId);
  };

  const fetchGradeDetails = async (gradeId) => {
    setLoadingGradeDetails(true);
    setErrorGradeDetails(null);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${apiConfig.apiUrl}/api/v1/grade/${gradeId}/details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGradeDetails(response.data);
    } catch (error) {
      console.error(
        `Error fetching grade details for grade ${gradeId}:`,
        error
      );
      setErrorGradeDetails(error);
      setGradeDetails(null);
    } finally {
      setLoadingGradeDetails(false);
    }
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setGradeDetails(null);
    setSelectedGradeId(null);
    setErrorGradeDetails(null);
    setLoadingGradeDetails(false);
  };

  // Function to be passed to GradeDetailsPopup to trigger refresh after delete
  const handleGradeDeleted = () => {
    handleClosePopup(); // Close the popup first
    if (refreshGradesList) {
      refreshGradesList(); // Call the refresh function passed as prop
    }
  };

  // Function to be passed to GradeDetailsPopup to trigger refresh after update
  const handleGradeUpdated = () => {
    handleClosePopup(); // Close the popup first
    if (refreshGradesList) {
      refreshGradesList(); // Call the refresh function passed as prop
    }
  };

  if (!grades) {
    return <p className="loading">Loading grades...</p>;
  }

  if (grades === null) {
    return <p className="error">Error loading grades</p>;
  }
  if (grades && grades.length > 0) {
    return (
      <>
        <ul className="grades-list">
          {grades.map((grade) => (
            <li
              className="grade-item"
              key={grade.id}
              onClick={() => handleGradeClick(grade.id)}
              style={{
                cursor: "pointer",
                backgroundColor: "blue",
                padding: "5px",
                borderRadius: "5px",
                color: "white",
                display: "inline-block",
                margin: "2px",
              }} // Make it visually clickable
            >
              {grade.grade}
            </li>
          ))}
        </ul>
        {isPopupVisible && (
          <GradeDetailsPopup
            gradeDetails={gradeDetails}
            onClose={handleClosePopup}
            onGradeUpdated={handleGradeUpdated} // Pass the refresh handler for update
            onGradeDeleted={handleGradeDeleted} // Pass the refresh handler for delete
            loading={loadingGradeDetails}
            error={errorGradeDetails}
          />
        )}
      </>
    );
  } else {
    return <p>No grades</p>;
  }
};

const GradeDetailsPopup = ({
  gradeDetails,
  onClose,
  loading,
  error,
  onGradeDeleted,
  onGradeUpdated,
  showNotification,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editedGrade, setEditedGrade] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedWeight, setEditedWeight] = useState(0);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    if (gradeDetails) {
      setEditedGrade(gradeDetails.grade);
      setEditedDescription(gradeDetails.description || "");
      setEditedWeight(gradeDetails.weight);
    }
  }, [gradeDetails]);

  const handleEditClick = () => {
    setEditMode(true);
  };
  const handleDeleteClick = async () => {
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(
        `${apiConfig.apiUrl}/api/v1/grade/${gradeDetails.id}/remove`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (onGradeDeleted) {
        // showNotification("Grade deleted successfully");
        onGradeDeleted(); // Call the refresh function passed as a prop
        onClose();
      }
    } catch (error) {
      setDeleteError(error.response?.data?.message || "Error deleting grade.");
    } finally {
      setDeleteLoading(false);
      showNotification("Grade deleted successfully");
    }
  };

  const handleSaveClick = async () => {
    setUpdateLoading(true);
    setUpdateError(null);
    try {
      const token = localStorage.getItem("authToken");
      await axios.patch(
        `${apiConfig.apiUrl}/api/v1/grade/${gradeDetails.id}/edit`,
        {
          grade: editedGrade,
          description: editedDescription,
          weight: Number(editedWeight),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (onGradeUpdated) {
        onGradeUpdated(); // Call the refresh function passed as a prop
        onClose();
      }
      setEditMode(false);
    } catch (error) {
      // console.log(error.request.responseText);
      setUpdateError(error.request.responseText || "Error updating grade.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancelClick = () => {
    setEditMode(false);
    setEditedGrade(gradeDetails.grade);
    setEditedDescription(gradeDetails.description || "");
    setEditedWeight(gradeDetails.weight);
    onClose();
  };

  if (loading) {
    return <div className="loading">Loading grade details...</div>;
  }

  if (error) {
    return (
      <div className="error">Error loading grade details: {error.message}</div>
    );
  }

  if (!gradeDetails) {
    return <div className="error">No grade details to display.</div>;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content1">
        <h3>Grade details</h3>
        {editMode ? (
          <>
            <div className="form-group">
              <label>Grade:</label>
              <input
                type="text"
                value={editedGrade}
                onChange={(e) => setEditedGrade(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Weight:</label>
              <input
                type="number"
                value={editedWeight}
                onChange={(e) => setEditedWeight(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
              />
            </div>
            {updateError && <div className="error">{updateError}</div>}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: "20px",
              }}
            >
              <button
                className="VerifyButton"
                onClick={handleSaveClick}
                disabled={updateLoading}
              >
                {updateLoading ? "Saving..." : "Save"}
              </button>
              <button
                className="DeactivateButton"
                onClick={handleCancelClick}
                disabled={updateLoading}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p>
              <strong>Grade:</strong> {gradeDetails.grade}
            </p>
            <p>
              <strong>Weight:</strong> {gradeDetails.weight}
            </p>
            <p>
              <strong>Description:</strong> {gradeDetails.description || "--"}
            </p>
            <p>
              <strong>Created at:</strong> {gradeDetails.createdAt}
            </p>
            <p>
              <strong>Updated at:</strong> {gradeDetails.updatedAt}
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: "20px",
              }}
            >
              <button className="VerifyButton" onClick={handleEditClick}>
                Edit
              </button>
              <button
                className="DeactivateButton"
                onClick={handleDeleteClick}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
              <button
                className="DeactivateButton"
                onClick={onClose}
                // style={{ backgroundColor: "#6c757d" }}
              >
                Close
              </button>
            </div>
            {deleteError && <div className="error">{deleteError}</div>}
          </>
        )}
      </div>
    </div>
  );
};

const AddGradePopup = ({ studentId, subjectId, onClose, onGradeAdded }) => {
  const [grade, setGrade] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddGrade = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `${apiConfig.apiUrl}/api/v1/grade/add`,
        {
          studentId: studentId,
          subjectId: subjectId,
          grade: grade,
          weight: Number(weight),
          description: description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGrade("");
      setWeight("");
      setDescription("");
      onClose();
      if (onGradeAdded) {
        onGradeAdded(); // Call the refresh function passed as a prop
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add grade");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content1">
        <h3>Add new grade</h3>
        <div className="form-group">
          <label>Grade:</label>
          <input
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Weight:</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            style={{ width: "calc(100%)" }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <button
            className="VerifyButton"
            onClick={handleAddGrade}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Grade"}
          </button>
          <button
            className="DeactivateButton"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassRoomList;
