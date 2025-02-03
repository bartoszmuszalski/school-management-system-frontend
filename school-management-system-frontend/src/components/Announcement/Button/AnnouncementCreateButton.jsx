import React, { useEffect, useState } from "react";
import apiConfig from "../../../config";

const AnnouncementCreateButton = ({
  announcementTitle,
  announcementMessage,
}) => {
  const handleCreateButton = async () => {
    // console.log(announcementTitle, announcementMessage);
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(
        `${apiConfig.apiUrl}/api/v1/announcement/create`,
        {
          method: "POST",
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
      onClick={handleCreateButton}
      className="VerifyButton"
      style={{ marginRight: "10px" }}
    >
      Create
    </button>
  );
};

export default AnnouncementCreateButton;
