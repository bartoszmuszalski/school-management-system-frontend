import React, { useEffect, useState } from "react";
import apiConfig from "../../config";
import "../Subjects/Subjects.css";
import AnnouncementRemoveButton from "./Button/AnnouncementRemoveButton";
import AnnouncementEditSaveButton from "./Button/AnnouncementEditSaveButton";
import AnnouncementCreateButton from "./Button/AnnouncementCreateButton";

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [showPopupDelete, setShowPopupDelete] = useState(false);
  const [showPopupEdit, setShowPopupEdit] = useState(false);
  const [showPopupCreate, setShowPopupCreate] = useState(false);
  const [announcementId, setAnnouncementId] = useState(null);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementMessage, setAnnouncementMessage] = useState("");

  useEffect(() => {
    fetch(`${apiConfig.apiUrl}/api/v1/announcements`)
      .then((response) => response.json())
      .then((data) => {
        setAnnouncements(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="container">
      <p className="myParagraphClass">Announcement list</p>

      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Message</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {announcements.length === 0 ? (
            <tr>
              <td colSpan="7">No announcements found.</td>
            </tr>
          ) : (
            announcements.map((announcement) => (
              <tr key={announcement.id}>
                <td>{announcement.title}</td>
                <td>{announcement.message}</td>
                <td>{announcement.createdAt}</td>
                <td>{announcement.updatedAt ?? "--"}</td>
                <td>
                  <button
                    onClick={() => {
                      setAnnouncementId(announcement.id);
                      setShowPopupDelete(true);
                    }}
                    className="DeactivateButton"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => {
                      setAnnouncementId(announcement.id);
                      setAnnouncementTitle(announcement.title);
                      setAnnouncementMessage(announcement.message);
                      setShowPopupEdit(true);
                    }}
                    className="ActivateButton"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <button
        className="create-classroom-button"
        style={{ width: "auto", backgroundColor: "#4f46e5" }}
        onClick={() => {
          setShowPopupCreate(true);
        }}
      >
        Create an announcement
      </button>

      {showPopupDelete && (
        <div className="delete-popup-overlay">
          <div className="delete-popup">
            <h3>Delete announcement</h3>
            <p>Are you sure you want to delete this announcement?</p>
            <div className="popup-buttons">
              <AnnouncementRemoveButton
                announcementId={announcementId}
                closePopup={() => setShowPopupDelete(false)}
              />
              <button
                onClick={() => setShowPopupDelete(false)}
                className="VerifyButton"
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showPopupEdit && (
        <div className="delete-popup-overlay">
          <div className="delete-popup">
            <h3>Edit announcement</h3>

            <div className="form-group">
              <label htmlFor="editSubjectName">Title:</label>
              <input
                placeholder="Title"
                type="text"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                style={{ marginBottom: "10px" }}
              ></input>
              <label htmlFor="editSubjectName">Message:</label>
              <textarea
                placeholder="Message"
                value={announcementMessage}
                onChange={(e) => setAnnouncementMessage(e.target.value)}
              />
            </div>
            <div className="popup-buttons">
              <AnnouncementEditSaveButton
                announcementId={announcementId}
                announcementTitle={announcementTitle}
                announcementMessage={announcementMessage}
                closePopup={() => setShowPopupEdit(false)}
              />
              <button
                onClick={() => setShowPopupEdit(false)}
                className="VerifyButton"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showPopupCreate && (
        <div className="delete-popup-overlay">
          <div className="delete-popup">
            <h3>Create announcement</h3>
            <div className="form-group">
              {/* <label htmlFor="editSubjectName">Announcement tiitle:</label> */}
              <label>Title:</label>
              <input
                type="text"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                placeholder="Title"
                style={{ minWidth: "250px" }}
              ></input>

              <label>Message:</label>
              <textarea
                placeholder="Message"
                value={announcementMessage}
                onChange={(e) => setAnnouncementMessage(e.target.value)}
                style={{ minWidth: "260px" }}
              />
            </div>
            <div className="popup-buttons">
              <AnnouncementCreateButton
                announcementTitle={announcementTitle}
                announcementMessage={announcementMessage}
                closePopup={() => setShowPopupCreate(false)}
              />
              <button
                onClick={() => setShowPopupCreate(false)}
                className="VerifyButton"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcement;
