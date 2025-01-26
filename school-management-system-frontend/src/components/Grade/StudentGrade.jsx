import React, { useState, useEffect } from "react";
import axios from "axios";
import apiConfig from "../../config";
import { useParams } from "react-router-dom";
import "./StudentGrade.css";

const StudentGrade = () => {
  const { studentId } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [errorSubjects, setErrorSubjects] = useState(null);

  useEffect(() => {
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
            const grades = await fetchGrades(subject.id);
            return { ...subject, grades: grades };
          })
        );
        setSubjects(subjectsWithGrades);
      } catch (err) {
        setErrorSubjects(err);
      } finally {
        setLoadingSubjects(false);
      }
    };
    fetchSubjects();
  }, [studentId]);

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
      return response.data;
    } catch (error) {
      console.error(`Error fetching grades for subject ${subjectId}:`, error);
      return null;
    }
  };

  return (
    <div className="student-grades-container">
      <h1>Student's grades ID: {studentId}</h1>
      {loadingSubjects && <p className="loading">Ładowanie przedmiotów...</p>}
      {errorSubjects && (
        <p className="error">
          Błąd ładowania przedmiotów: {errorSubjects.message}
        </p>
      )}
      {subjects.length > 0 && (
        <table className="grades-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Lead</th>
              <th>Grades</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.id}>
                <td>{subject.name}</td>
                <td>{`${subject.teacherFirstName} ${subject.teacherLastName}`}</td>
                <td>
                  <GradesDisplay grades={subject.grades} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const GradesDisplay = ({ grades }) => {
  if (!grades) {
    return <p className="loading">Loading grades...</p>;
  }

  if (grades === null) {
    return <p className="error">Error while loading grades</p>;
  }

  if (grades && grades.length > 0) {
    return (
      <ul className="grades-list">
        {grades.map((grade) => (
          <li
            className="grade-item"
            key={grade.id}
            data-tooltip={`Grade: ${grade.grade}, Description: ${grade.description}, Weight: ${grade.weight}, Created at: ${grade.createdAt}`}
          >
            {grade.grade}
          </li>
        ))}
      </ul>
    );
  } else {
    return <p>No grades</p>;
  }
  // if (grades && grades.length > 0) {
  //   return (
  //     <ul className="grades-list">
  //       {grades.map((grade) => (
  //         <li
  //           className="grade-item"
  //           key={grade.id}
  //           data-tooltip={`Grade: ${grade.grade}, Description: ${grade.description}, Weight: ${grade.weight}, Created at: ${grade.createdAt}`}
  //         >
  //           {grade.grade}
  //         </li>
  //       ))}
  //     </ul>
  //   );
  // } else {
  //   return <p>No grades</p>;
  // }
};

export default StudentGrade;
