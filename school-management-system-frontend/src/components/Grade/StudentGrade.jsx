import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import apiConfig from "../../config";
import { useParams } from "react-router-dom";
import "./StudentGrade.css";
import GradeDetailsPopup from "./GradeDetailsPopup"; // Import the new popup component
import AddGradePopup from "./AddGradePopup"; // Import the AddGradePopup component
import { AuthContext } from "../../contexts/AuthContext";

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

const StudentGrade = () => {
  const { studentId } = useParams();
  const { user } = useContext(AuthContext);
  const [subjects, setSubjects] = useState([]);
  const [fullName, setFullName] = useState();
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [errorSubjects, setErrorSubjects] = useState(null);
  const [isAddGradePopupVisible, setIsAddGradePopupVisible] = useState(false); // State for AddGradePopup
  const [selectedSubjectIdForGrade, setSelectedSubjectIdForGrade] =
    useState(null); // Track subject for adding grade
  const isAdmin =
    user &&
    user.roles &&
    user.roles.some((role) => role.toUpperCase() === "ROLE_ADMIN");

  const isTeacher =
    user &&
    user.roles &&
    user.roles.some((role) => role.toUpperCase() === "ROLE_TEACHER");

  useEffect(() => {
    fetchSubjects(); // Call fetchSubjects on component mount
  }, [studentId]);

  const fetchSubjects = async () => {
    setLoadingSubjects(true);
    setErrorSubjects(null);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${apiConfig.apiUrl}/api/v1/student/${studentId}/details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const subjectsWithGrades = await Promise.all(
        response.data.subjects.map(async (subject) => {
          const gradesData = await fetchGrades(subject.id); // Fetch grades data (including average)
          return {
            ...subject,
            grades: gradesData.grades, // Extract grades array
            average: gradesData.average, // Extract average
          };
        })
      );
      // console.log(fullName);
      setSubjects(subjectsWithGrades);
      setFullName(
        response.data.studentFirstName + " " + response.data.studentLastName
      );
    } catch (err) {
      setErrorSubjects(err);
    } finally {
      setLoadingSubjects(false);
    }
  };

  const fetchGrades = async (subjectId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${apiConfig.apiUrl}/api/v1/student/${studentId}/grades?subjectId=${subjectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data; // Return the entire response data
    } catch (error) {
      console.error(`Error fetching grades for subject ${subjectId}:`, error);
      return { grades: null, average: null }; // Return nulls in case of error
    }
  };

  const handleOpenAddGradePopup = (subjectId) => {
    setSelectedSubjectIdForGrade(subjectId);
    setIsAddGradePopupVisible(true);
  };

  const handleCloseAddGradePopup = () => {
    setIsAddGradePopupVisible(false);
    setSelectedSubjectIdForGrade(null);
  };

  return (
    <div className="student-grades-container">
      <h1>Student's grades ID: {fullName}</h1>
      {loadingSubjects && <p className="loading">Loading subjects...</p>}
      {errorSubjects && <p className="error">{errorSubjects.message}</p>}
      {subjects.length > 0 && (
        <table className="grades-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Lead</th>
              <th>Grades</th>
              <th>Average</th> {/* New Average column */}
              {isTeacher && <th>Action</th>} {/* New Action column */}
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.id}>
                <td>
                  <p style={{ fontWeight: "bold" }}>{subject.name}</p>
                </td>
                <td>{`${subject.teacherFirstName} ${subject.teacherLastName}`}</td>
                <td>
                  <GradesDisplay
                    grades={subject.grades}
                    subjectId={subject.id} // Pass subjectId to GradesDisplay
                    refreshGradesList={fetchSubjects} // Pass fetchSubjects function
                  />
                </td>
                <td>{subject.average ? subject.average.toFixed(2) : "--"}</td>{" "}
                {/* Display Average */}
                {isTeacher && (
                  <td>
                    <button
                      className="AddButton" // Add class for styling if needed
                      onClick={() => handleOpenAddGradePopup(subject.id)}
                    >
                      Add grade
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add Grade Popup */}
      {isAddGradePopupVisible && (
        <AddGradePopup
          studentId={studentId}
          subjectId={selectedSubjectIdForGrade}
          onClose={handleCloseAddGradePopup}
          onGradeAdded={fetchSubjects} // Refresh subjects list after adding grade
        />
      )}
    </div>
  );
};

const GradesDisplay = ({ grades, subjectId, refreshGradesList }) => {
  // Receive refreshGradesList
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
    return <p className="error">Erorr while loading grades...</p>;
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
                backgroundColor: getGradeColor(grade.grade),
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

export default StudentGrade;
