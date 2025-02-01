import React, { useEffect, useState } from "react";
import apiConfig from "../../../config";

const AnnouncementRemoveButton = ({ announcementId }) => {
  const handleRemoveButton = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(
        `${apiConfig.apiUrl}/api/v1/announcement/${announcementId}/remove`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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
    <button onClick={handleRemoveButton} className="DeactivateButton">
      Delete
    </button>
  );
};

export default AnnouncementRemoveButton;
