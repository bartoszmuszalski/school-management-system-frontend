import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./DisplayUsers.css";
import verified from "../Files/verified.png";
import unverified from "../Files/unverified.png";
import apiConfig from "../../config";
import StudentGrade from "../Grade/StudentGrade";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

// Constants for user roles
const ROLE_ADMIN = "ROLE_ADMIN";

const DisplayUsers = () => {
  // State for users, loading, error, and pagination
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const [limit, setLimit] = useState(10); // Number of users per page
  const isAdmin =
    user &&
    user.roles &&
    user.roles.some((role) => role.toUpperCase() === "ROLE_ADMIN");

  const isTeacher =
    user &&
    user.roles &&
    user.roles.some((role) => role.toUpperCase() === "ROLE_TEACHER");
  // State for search phrase
  const [searchPhrase, setSearchPhrase] = useState("");

  // State for popup
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUserRole, setNewUserRole] = useState("");

  // State for details popup
  const [isDetailsPopupOpen, setIsDetailsPopupOpen] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);

  // State for success notification
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // State for user role
  const [userRole, setUserRole] = useState(null);

  // Retrieve user role from localStorage on component mount
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userObj = JSON.parse(user);
      const roles = String(userObj.roles);
      setUserRole(roles);
    }
  }, []);

  // Function to fetch users with pagination and search
  const fetchUsers = async (page, searchPhrase = "") => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
    try {
      // Construct URL with search phrase if provided
      let url = `${apiConfig.apiUrl}/api/v1/users/list?page=${page}&limit=${limit}`;
      if (searchPhrase) {
        url += `&searchPhrase=${searchPhrase}`;
      }
      // console.log("Fetching users from:", url); // Debugging log
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token to headers
        },
      });
      // console.log("Response data:", response.data); // Debugging log
      setUsers(response.data.data);
      setTotalPages(Math.ceil(response.data.total / limit));
      // console.log(response.data.total);
    } catch (err) {
      console.error("Error fetching users:", err); // Debugging log
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when component mounts or when currentPage or searchPhrase changes
  useEffect(() => {
    // console.log(userRole);

    if (userRole === ROLE_ADMIN) {
      fetchUsers(currentPage); // Fetch initial users without search phrase
    }
  }, [currentPage, userRole]); // Removed searchPhrase from dependency array

  // Function to verify a user (without API calls)
  const handleActivationToggle = async (userId, isActivated) => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(
        `${apiConfig.apiUrl}/api/v1/user/${userId}/change_activation`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActivated: !isActivated }), // Toggle the activation status
        }
      );

      if (response.status === 204) {
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, isActivated: !isActivated } : user
          )
        );
        const action = isActivated ? "deactivated" : "activated";
        setSuccessMessage(`User ${userId} has been ${action}.`);
        setShowSuccess(true);
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error toggling user activation:", error);
    }
  };
  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // Function to go to the previous page
  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // Function to go to the next page
  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Function to handle role change with popup
  const handleChangeRole = (user, newRole) => {
    setSelectedUser(user);
    setNewUserRole(newRole);
    setIsPopupOpen(true);
  };

  const handleSeeDetails = (user) => {
    // console.log(user);
    setSelectedUserDetails(user);
    setIsDetailsPopupOpen(true);
  };

  const closeDetailsPopup = () => {
    setIsDetailsPopupOpen(false);
    setSelectedUserDetails(null);
  };

  // Function to confirm role change
  const confirmChangeRole = async () => {
    if (!selectedUser || !newUserRole) return;

    const token = localStorage.getItem("authToken"); // Retrieve token from localStorage

    try {
      const response = await axios.post(
        `${apiConfig.apiUrl}/api/v1/user/${selectedUser.id}/change_role`, // API endpoint
        { role: `ROLE_${newUserRole}` }, // Request body
        {
          headers: {
            Authorization: `Bearer ${token}`, // Authorization headers
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "ok") {
        // Update users state on successful response
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === selectedUser.id
              ? { ...user, role: `ROLE_${newUserRole}` }
              : user
          )
        );
        // Set success message
        setSuccessMessage(
          `Successfully changed the role of ${selectedUser.email} to ${newUserRole}.`
        );
        setShowSuccess(true);
      } else {
        // Handle other response statuses
        console.error("Failed to change user role:", response.data.message);
        // Optionally, display an error message to the user
      }
    } catch (err) {
      setSuccessMessage(`["VALIDATION.USER_NOT_ACTIVATED"]`);
      setShowSuccess(true);
      // Optionally, display an error message to the user
    } finally {
      // Close the popup
      setIsPopupOpen(false);
      setSelectedUser(null);
      setNewUserRole("");
    }
  };

  // Function to cancel role change
  const cancelChangeRole = () => {
    setIsPopupOpen(false);
    setSelectedUser(null);
    setNewUserRole("");
  };

  // Function to handle search button click
  const handleSearch = () => {
    fetchUsers(1, searchPhrase); // Fetch users with the current search phrase, starting from page 1
    setCurrentPage(1); // Reset to page 1 after search
  };

  const handleGoToGrades = () => {
    if (selectedUserDetails) {
      navigate(`/student/${selectedUserDetails.studentId}/grades`);
    }
    closeDetailsPopup();
  };
  // Handle automatic hiding of success notification
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage("");
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // Handle loading and error states
  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  if (error) {
    return <p className="error">You are not authorized to access this page.</p>;
  }

  // Conditional rendering based on user role
  if (userRole !== ROLE_ADMIN) {
    return (
      <div className="access-denied">
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  // Render the user list for admin
  return (
    <div className="container">
      <p className="myParagraphClass">User list in the system</p>

      {/* Search input field and button */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search users..."
          className="search-input"
          value={searchPhrase}
          onChange={(e) => setSearchPhrase(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
            <th>Activated</th>
            <th>Action</th>
            <th>Change role</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="7">No users found.</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td style={{ fontWeight: "bold" }}>{user.email}</td>
                <td>{`${user.firstName} ${user.lastName}`}</td>
                <td>
                  {user.role.slice(5).charAt(0).toUpperCase() +
                    user.role.slice(6).toLowerCase()}
                </td>
                <td>
                  {user.isActivated ? (
                    <img src={verified} alt="Verified" className="verify_img" />
                  ) : (
                    <img
                      src={unverified}
                      alt="Unverified"
                      className="verify_img"
                    />
                  )}
                </td>
                <td>
                  {user.isActivated ? (
                    <button
                      className="DeactivateButton"
                      onClick={() =>
                        handleActivationToggle(user.id, user.isActivated)
                      }
                      aria-label={`Deactivate user ${user.email}`}
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      className="ActivateButton"
                      onClick={() =>
                        handleActivationToggle(user.id, user.isActivated)
                      }
                      aria-label={`Activate user ${user.email}`}
                    >
                      Activate
                    </button>
                  )}
                  <button // Remove the space before this button
                    className="SeeDetailsButton"
                    onClick={() => handleSeeDetails(user)}
                  >
                    Details
                  </button>
                </td>
                <td>
                  <select
                    value={user.role.replace("ROLE_", "")} // Remove ROLE_ prefix
                    onChange={(e) => handleChangeRole(user, e.target.value)}
                    aria-label={`Change role for ${user.email}`}
                  >
                    <option value="USER">User</option>
                    <option value="STUDENT">Student</option>
                    <option value="TEACHER">Teacher</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={page === currentPage ? "active" : ""}
            >
              {page}
            </button>
          )
        )}
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

      {/* Confirmation Popup */}
      {isPopupOpen && selectedUser && (
        <div className="popup-overlay">
          <div className="popup">
            <p>
              Are you sure you want to change the role of{" "}
              <strong>{selectedUser.email}</strong> to{" "}
              <strong>{newUserRole}</strong>?
            </p>
            <div className="popup-buttons">
              <button className="popup-button yes" onClick={confirmChangeRole}>
                Yes
              </button>
              <button className="popup-button no" onClick={cancelChangeRole}>
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccess && (
        <div className="success-notification">
          <p>{successMessage}</p>
        </div>
      )}

      {/* Details Popup */}
      {isDetailsPopupOpen && selectedUserDetails && (
        <div className="popup-overlay">
          <div className="popup-1">
            <h3>Details for {selectedUserDetails.email}</h3>
            <p>
              <strong>ID:</strong> {selectedUserDetails.id}
            </p>
            <p>
              <strong>First name:</strong> {selectedUserDetails.firstName}
            </p>
            <p>
              <strong>Last name:</strong> {selectedUserDetails.lastName}
            </p>
            <p>
              <strong>Email:</strong> {selectedUserDetails.email}
            </p>
            <p>
              <strong>Created at:</strong> {selectedUserDetails.createdAt}
            </p>
            <p>
              <strong>Activated:</strong>{" "}
              {selectedUserDetails.isActivated ? "Yes" : "No"}
            </p>
            <p>
              <strong>Verified:</strong>{" "}
              {selectedUserDetails.isVerified ? "Yes" : "No"}
            </p>
            <p>
              <strong>Role:</strong> {selectedUserDetails.role}
            </p>
            <button
              className="DeactivateButton"
              onClick={closeDetailsPopup}
              style={{ marginTop: "20px" }}
            >
              Close
            </button>
            {selectedUserDetails.role === "ROLE_STUDENT" && (
              <button
                className="DeactivateButton"
                onClick={() => handleGoToGrades()}
                style={{
                  width: "auto",
                  fontSize: "18px",
                  height: "47px",
                  backgroundColor: "lightblue",
                  marginTop: "10px",
                }}
              >
                Display student grade
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default DisplayUsers;
