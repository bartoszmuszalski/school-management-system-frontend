import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import apiConfig from "../../config";
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import "./MySubjects.css";

const MySubjects = () => {
  const { user } = useContext(AuthContext);
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [errorSubjects, setErrorSubjects] = useState(null);

  useEffect(() => {
    fetchMySubjects();
  }, []);

  const fetchMySubjects = async () => {
    setLoadingSubjects(true);
    setErrorSubjects(null);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${apiConfig.apiUrl}/api/v1/student/my_subjects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (
        response.data &&
        response.data.subjects &&
        Array.isArray(response.data.subjects)
      ) {
        setSubjects(response.data.subjects);
      } else {
        throw new Error("Unexpected data format from server");
      }
    } catch (err) {
      setErrorSubjects(err);
    } finally {
      setLoadingSubjects(false);
    }
  };

  if (loadingSubjects)
    return <div className="loading">Loading subjects...</div>;
  if (errorSubjects)
    return (
      <div className="error">
        Error loading subjects: {errorSubjects.message}
      </div>
    );

  return (
    <>
      <div className="my-subject1-container">
        <h3>My subjects</h3>
        {subjects.length === 0 ? (
          <p>No subjects available.</p>
        ) : (
          <table className="subject1-table">
            <thead>
              <tr>
                <th>Subject name</th>
                <th>Teacher</th>
                <th>Teacher email</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.id}>
                  <td>{subject.name}</td>
                  <td>
                    {subject.teacherFirstName} {subject.teacherLastName}
                  </td>
                  <td>{subject.teacherEmail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Link to="/my_grades">
        <button
          className="create-classroom-button"
          style={{ fontFamily: "Roboto Slab, serif", width: "300px" }}
        >
          Display grades
        </button>
      </Link>
    </>
  );
};

export default MySubjects;
