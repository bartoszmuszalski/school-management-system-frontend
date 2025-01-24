import React, { useState, useEffect } from "react";
import axios from "axios";
import "../ClassRoom/ClassRoom.css";
import { useNavigate } from "react-router-dom";
import apiConfig from "../../config";

function CreateSubject() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [teacherId, setTeacherId] = useState("");
  const [teachersLoading, setTeachersLoading] = useState(true);
  const [teachersError, setTeachersError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
      setTeachersLoading(true);
      setTeachersError(null);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setTeachersError("Authentication token not found.");
          setTeachers([]);
          return;
        }

        const response = await axios.get(
          `${apiConfig.apiUrl}/api/v1/teachers/list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setTeachers(response.data.data);
        } else {
          setTeachersError("Failed to fetch teachers.");
          setTeachers([]);
        }
      } catch (err) {
        setTeachersError(
          err.response?.data?.message ||
            "An error occurred while fetching teachers."
        );
        setTeachers([]);
      } finally {
        setTeachersLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication token not found.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${apiConfig.apiUrl}/api/v1/subject/create`,
        { teacherId, name, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        navigate("/subjects", {
          state: {
            successMessage: `Subject "${name}" has been successfully added.`,
          },
        });
      } else {
        setError("Failed to create subject.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Teacher already assigned to other subject."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <p className="myParagraphClass">Create a new subject</p>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label
            className="label"
            htmlFor="subjectName"
            style={{
              margin: "auto",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            New subject name:
          </label>
          <input
            type="text"
            id="subjectName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter subject name"
            style={{ width: "200px", margin: "auto" }}
          />
        </div>
        <div className="form-group">
          <label
            className="label"
            htmlFor="subjectDescription"
            style={{
              margin: "auto",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            Subject description:
          </label>
          <textarea
            id="subjectDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter subject description"
            style={{ width: "200px", margin: "auto" }}
          />
        </div>
        <div className="form-group">
          <label
            className="label"
            htmlFor="teacherId"
            style={{
              margin: "auto",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            Select Teacher:
          </label>
          {teachersLoading ? (
            <p className="loading">Loading teachers...</p>
          ) : teachersError ? (
            <p className="error">{teachersError}</p>
          ) : (
            <select
              id="teacherId"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              required
              style={{ width: "200px", margin: "auto" }}
            >
              <option value="">-- Select a teacher --</option>
              {teachers.map((teacher) => (
                <option key={teacher.teacherId} value={teacher.teacherId}>
                  {`${teacher.firstName} ${teacher.lastName} (${teacher.email})`}
                </option>
              ))}
            </select>
          )}
        </div>
        {error && <p className="error">{error}</p>}
        <button
          type="submit"
          className="VerifyButton"
          style={{ width: "200px", margin: "auto" }}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create subject"}
        </button>
      </form>
    </div>
  );
}

export default CreateSubject;
