import React, { useState } from "react";
import "../../components/ClassRoom/ClassRoom.css"; // Reusing ClassRoom.css for basic popup styling
import axios from "axios";
import apiConfig from "../../config";
import "./AddGradePopup.css"; // Import CSS for AddGradePopup

const AddGradePopup = ({ studentId, subjectId, onClose, onGradeAdded }) => {
  const [grade, setGrade] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [addError, setAddError] = useState(null);
  const [addLoading, setAddLoading] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  const handleSaveClick = async () => {
    setAddLoading(true);
    setAddError(null);
    setAddSuccess(false);
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `${apiConfig.apiUrl}/api/v1/grade/add`,
        {
          studentId: studentId,
          subjectId: subjectId,
          grade: grade,
          weight: Number(weight), // Ensure weight is a number
          description: description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAddSuccess(true);
      // Optionally clear the form after successful add
      setGrade("");
      setWeight("");
      setDescription("");
      if (onGradeAdded) {
        onGradeAdded(); // Refresh grades list in parent component
      }
      setTimeout(onClose, 1500); // Close popup after 1.5s success message
    } catch (error) {
      console.error("Error adding grade:", error);
      setAddError(error);
      setAddSuccess(false);
    } finally {
      setAddLoading(false);
    }
  };

  const handleCancelClick = () => {
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup add-grade-popup">
        {" "}
        {/* Added add-grade-popup class */}
        <h2 className="popup-title">Add new grade</h2>{" "}
        {/* Added popup-title class */}
        {addSuccess && (
          <p className="success-notification">Grade added successfully!</p>
        )}
        {addError && (
          <p className="error">Error adding grade: {addError.message}</p>
        )}
        {addLoading && <p className="loading">Adding grade...</p>}
        <div className="add-grade-form">
          <div className="form-group">
            <label htmlFor="grade">Grade:</label>
            <input
              type="text"
              id="grade"
              name="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="weight">Weight:</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="popup-buttons popup-buttons5">
          <button
            className="popup-button save-button yes" // Added save-button class
            onClick={handleSaveClick}
            disabled={addLoading}
          >
            {addLoading ? "Saving..." : "Add"}
          </button>
          <button
            className="popup-button-no" // Added cancel-button class
            onClick={handleCancelClick}
            disabled={addLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddGradePopup;
