import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import apiConfig from "../../config";
import "./StudentGrade.css";
import { AuthContext } from "../../contexts/AuthContext";

const getGradeColor = (grade) => {
  const gradeValue = parseInt(grade, 10);
  if (isNaN(gradeValue)) return "gray";

  switch (gradeValue) {
    case 1:
      return "#008080";
    case 2:
      return "#4682B4";
    case 3:
      return "#66CDAA";
    case 4:
      return "#3CB371";
    case 5:
      return "#FFD700";
    case 6:
      return "#FF8C00";
    default:
      return "lightgray";
  }
};

const MyGrades = () => {
  const { user } = useContext(AuthContext);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyGrades();
  }, []);

  const fetchMyGrades = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${apiConfig.apiUrl}/api/v1/student/my_grades`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data && typeof response.data === "object") {
        const subjectsArray = Object.values(response.data);
        setSubjects(subjectsArray);
      } else {
        throw new Error("Unexpected data format from server");
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading subjects...</div>;
  if (error) return <div>Error loading subjects: {error.message}</div>;

  return (
    <div
      className="student-grade-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "60px",
      }}
    >
      <h3>My grades</h3>
      {subjects.length === 0 ? (
        <p>No grades available.</p>
      ) : (
        <table
          className="grades-table"
          style={{ margin: "0 auto", marginTop: "20px" }}
        >
          <thead>
            <tr>
              <th style={{ fontSize: "18px" }}>Subject name</th>
              <th style={{ fontSize: "18px" }}>Grades</th>
              <th style={{ fontSize: "18px" }}>Average</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.subjectId}>
                <td style={{ fontSize: "18px" }}>{subject.subjectName}</td>
                <td>
                  {subject.grades && subject.grades.length > 0 ? (
                    <div className="grades-list">
                      {subject.grades.map((grade) => (
                        <span
                          key={grade.id}
                          className="grade-item"
                          style={{
                            backgroundColor: getGradeColor(grade.grade),
                            dispaly: "flex",
                            position: "relative",
                            justifyContent: "center",
                            verticalAlign: "middle",
                          }}
                          data-tooltip={`Weight: ${grade.weight}\nDescription: ${grade.description}\nCreated at: ${grade.createdAt}`}
                        >
                          {grade.grade}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "No grades yet"
                  )}
                </td>
                <td style={{ fontSize: "18px" }}>
                  {subject.average ? subject.average.toFixed(2) : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyGrades;
