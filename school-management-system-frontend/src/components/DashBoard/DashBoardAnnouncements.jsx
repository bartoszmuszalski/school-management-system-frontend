import React, { useEffect, useState } from "react";
import apiConfig from "../../config";
import "./DashBoardAnnouncements.css";
import announcement_pic from "./announcement.png"; // Zdjęcie ogłoszenia

const DashBoardAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [expandedMessage, setExpandedMessage] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  useEffect(() => {
    fetch(`${apiConfig.apiUrl}/api/v1/announcements`)
      .then((response) => response.json())
      .then((data) => {
        setAnnouncements(data);
        // console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="announcement-container">
      {announcements.length > 0 ? (
        announcements.map((announcement) => (
          <>
            <div key={announcement.id} className="announcement-item">
              <div className="announcement-image">
                <img src={announcement_pic} alt="Announcement" />
              </div>
              <div className="announcement-text">
                <div className="announcement-title">
                  <h2>{announcement.title}</h2>
                </div>
                <div className="announcement-message">
                  <td>
                    {announcement.message &&
                    announcement.message.length > 30 ? (
                      <>
                        {announcement.message.substring(0, 150)}...
                        <span
                          style={{
                            color: "blue",
                            cursor: "pointer",
                            marginLeft: "5px",
                            textDecoration: "underline",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedMessage(announcement.message);
                            setIsMessageModalOpen(true);
                          }}
                        >
                          [expand]
                        </span>
                      </>
                    ) : (
                      announcement.message
                    )}
                  </td>
                </div>
              </div>
            </div>
            <div> </div>
          </>
        ))
      ) : (
        <p>No announcements yet.</p>
      )}
      {isMessageModalOpen && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1003,
          }}
        >
          <div
            className="modal-content1"
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "8px",
              maxWidth: "80%",
              maxHeight: "80%",
              overflow: "auto",
            }}
          >
            <h3>Message:</h3>
            <p style={{ whiteSpace: "pre-line" }}>{expandedMessage}</p>
            <button
              class="DeactivateButton"
              onClick={() => setIsMessageModalOpen(false)}
              style={{ margin: "0px auto" }}

              // style={{ backgroundColor: "#dc3545", width: "40px" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashBoardAnnouncements;
