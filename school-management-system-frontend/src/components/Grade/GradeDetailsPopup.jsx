import React, { useState } from "react";
import "../../components/ClassRoom/ClassRoom.css";
import axios from "axios";
import apiConfig from "../../config";

// Expecting onGradeUpdated and onGradeDeleted props
const GradeDetailsPopup = ({
  gradeDetails,
  onClose,
  onGradeUpdated,
  onGradeDeleted,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedGradeDetails, setEditedGradeDetails] = useState({
    grade: gradeDetails?.grade || "",
    weight: gradeDetails?.weight || 0,
    description: gradeDetails?.description || "",
  });
  const [updateError, setUpdateError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
    useState(false); // State for delete confirmation
  const [deleteError, setDeleteError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const handleEditClick = () => {
    setIsEditMode(true);
    setEditedGradeDetails({
      grade: gradeDetails?.grade || "",
      weight: gradeDetails?.weight || 0,
      description: gradeDetails?.description || "",
    });
    setUpdateError(null);
    setUpdateSuccess(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedGradeDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveClick = async () => {
    setUpdateLoading(true);
    setUpdateError(null);
    setUpdateSuccess(false);
    try {
      const token = localStorage.getItem("authToken");
      await axios.patch(
        `${apiConfig.apiUrl}/api/v1/grade/${gradeDetails.id}/edit`,
        {
          ...editedGradeDetails,
          weight: Number(editedGradeDetails.weight), // Ensure weight is a number
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUpdateSuccess(true);
      setIsEditMode(false);
      if (onGradeUpdated) {
        onGradeUpdated(); // Refresh grades in parent
      }
    } catch (error) {
      console.error("Error updating grade details:", error);
      // console.log("CATCH BLOCK EXECUTED!"); // Add this line
      setUpdateError(
        error.response?.data?.message || error.message || "An error occurred"
      ); // Access nested message if available, or fallback
      setUpdateSuccess(false);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setUpdateError(null);
    setUpdateSuccess(false);
  };

  const handleDeleteClick = () => {
    setIsDeleteConfirmationVisible(true); // Show delete confirmation popup
    setDeleteError(null);
    setDeleteSuccess(false);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    setDeleteError(null);
    setDeleteSuccess(false);
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
      setDeleteSuccess(true);
      setIsDeleteConfirmationVisible(false); // Hide confirmation popup
      onClose(); // Close the main popup
      if (onGradeDeleted) {
        onGradeDeleted(); // Refresh grades in parent
      }
    } catch (error) {
      console.error("Error deleting grade:", error);
      setDeleteError(error);
      setDeleteSuccess(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmationVisible(false); // Hide confirmation popup
    setDeleteError(null);
    setDeleteSuccess(false);
  };

  return (
    <div className="popup-overlay">
      <div className="popup edit-popup grade-details-popup">
        {" "}
        {/* Added grade-details-popup class */}
        <h3>Grade details</h3> {/* Added popup-title class */}
        {updateSuccess && !isEditMode && (
          <p className="success-notification">
            Grade details updated successfully!
          </p>
        )}
        {console.log("updateError:", updateError, "isEditMode:", isEditMode)}{" "}
        {/* Add this line for debugging */}
        {updateError && (
          <p className="error">Error updating grade details: {updateError}</p>
        )}
        {updateLoading && !isEditMode && (
          <p className="loading">Updating grade details...</p>
        )}
        {deleteSuccess && !isDeleteConfirmationVisible && (
          <p className="success-notification">Grade deleted successfully!</p>
        )}
        {deleteError && isDeleteConfirmationVisible && (
          <p className="error">Error deleting grade: {deleteError.message}</p>
        )}
        {deleteLoading && isDeleteConfirmationVisible && (
          <p className="loading">Deleting grade...</p>
        )}
        {!isEditMode ? (
          <div className="grade-details">
            <p className="detail-item">
              {" "}
              {/* Added detail-item class */}
              <strong>Description:</strong>{" "}
              {gradeDetails?.description || "No description"}
            </p>
            <p className="detail-item">
              {" "}
              {/* Added detail-item class */}
              <strong>Weight:</strong> {gradeDetails?.weight}
            </p>
            <p className="detail-item">
              {" "}
              {}
              <strong>Description:</strong> {gradeDetails?.description}
            </p>
            {gradeDetails?.createdAt && (
              <p className="detail-item">
                {" "}
                {/* Added detail-item class */}
                <strong>Created at:</strong> {gradeDetails.createdAt}
              </p>
            )}
            {gradeDetails?.updatedAt && (
              <p className="detail-item">
                {" "}
                {/* Added detail-item class */}
                <strong>Updated at:</strong> {gradeDetails.updatedAt}
              </p>
            )}
            {/* {gradeDetails?.teacherFirstName && (
              <p className="detail-item">
                <strong>Teacher First Name:</strong>{" "}
                {gradeDetails.teacherFirstName}
              </p>
            )} */}

            {gradeDetails?.teacherLastName && (
              <p className="detail-item">
                {" "}
                {/* Added detail-item class */}
                <strong>Teacher's name:</strong>{" "}
                {gradeDetails.teacherFirstName +
                  " " +
                  gradeDetails.teacherLastName}
              </p>
            )}
            {gradeDetails?.teacherEmail && (
              <p className="detail-item">
                {" "}
                {/* Added detail-item class */}
                <strong>Teacher email:</strong> {gradeDetails.teacherEmail}
              </p>
            )}
            <p className="detail-item">
              {" "}
              {/* Added detail-item class */}
              <strong>Grade ID:</strong> {gradeDetails?.id}
            </p>
          </div>
        ) : (
          <div className="edit-grade-form">
            <div className="form-group">
              <label htmlFor="grade">Grade:</label>
              <input
                type="text"
                id="grade"
                name="grade"
                value={editedGradeDetails.grade}
                onChange={handleInputChange}
                placeholder={gradeDetails.grade}
              />
            </div>
            <div className="form-group">
              <label htmlFor="weight">Weight:</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={editedGradeDetails.weight}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={editedGradeDetails.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}
        <div className="popup-buttons popup-buttons5">
          {!isEditMode ? (
            <>
              <button
                className="popup-button edit-grade-button yes"
                onClick={handleEditClick}
              >
                {" "}
                {/* Added edit-grade-button class */}
                Edit
              </button>
              <button
                className="popup-button close-button no"
                onClick={handleDeleteClick}
              >
                {" "}
                {/* Added delete-grade-button class */}
                Delete
              </button>
              <button
                className="popup-button close-button no"
                onClick={onClose}
              >
                {" "}
                {/* Added close-button class */}
                Close
              </button>
            </>
          ) : (
            <>
              <button
                className="popup-button save-button yes" // Added save-button class
                onClick={handleSaveClick}
                disabled={updateLoading}
              >
                {updateLoading ? "Saving..." : "Save"}
              </button>
              <button
                className="popup-button cancel-button no" // Added cancel-button class
                onClick={handleCancelEdit}
                disabled={updateLoading}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Delete confirmation popup */}
      {isDeleteConfirmationVisible && (
        <div className="popup confirmation-popup delete-confirmation-popup">
          {" "}
          {/* Added delete-confirmation-popup class */}
          <p className="confirmation-message">
            Are you sure you want to delete this grade?
          </p>{" "}
          {/* Added confirmation-message class */}
          <div className="popup-buttons confirmation-buttons">
            {" "}
            {/* Added confirmation-buttons class */}
            <button
              className="popup-button confirm-delete-button yes" // Added confirm-delete-button class
              onClick={handleConfirmDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Yes, Delete"}
            </button>
            <button
              className="popup-button cancel-delete-button no" // Added cancel-delete-button class
              onClick={handleCancelDelete}
              disabled={deleteLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradeDetailsPopup;
