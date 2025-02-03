import React, { useEffect, useState } from "react";
import apiConfig from "../../../config";

const AnnouncementEditSaveButton = ({
  announcementId,
  announcementTitle,
  announcementMessage,
}) => {
  const handleEditSaveButton = async () => {
    // console.log(announcementId, announcementTitle, announcementMessage);
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(
        `${apiConfig.apiUrl}/api/v1/announcement/${announcementId}/edit`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: announcementTitle,
            message: announcementMessage,
          }),
        }
      );

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      onClick={handleEditSaveButton}
      className="VerifyButton"
      style={{ marginRight: "10px" }}
    >
      Edit
    </button>
  );
};

export default AnnouncementEditSaveButton;
