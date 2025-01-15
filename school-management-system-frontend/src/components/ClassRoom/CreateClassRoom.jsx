import React, { useState } from "react";
import axios from "axios";
import "./ClassRoom.css"; // Reuse existing styles
import { useNavigate } from "react-router-dom";

function CreateClassRoom() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // For navigation after creation

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
        "http://localhost/api/v1/class_room/create",
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Assuming a successful creation returns status 201 or similar
      if (response.status === 201 || response.data.status === "success") {
        // Optionally, show a success message
        navigate("/classroom"); // Redirect to classroom list
      } else {
        setError("Failed to create classroom.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while creating the classroom."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <p className="myParagraphClass">Create a New Classroom</p>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="className">Classroom Name:</label>
          <input
            type="text"
            id="className"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter classroom name"
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="VerifyButton" disabled={loading}>
          {loading ? "Creating..." : "Create Classroom"}
        </button>
      </form>
    </div>
  );
}

export default CreateClassRoom;
