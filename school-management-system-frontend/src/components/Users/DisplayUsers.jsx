import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DisplayUsers.css";

// Constants for user roles
const ROLE_ADMIN = "ROLE_ADMIN";
const ROLE_TEACHER = "ROLE_TEACHER";
const ROLE_STUDENT = "ROLE_STUDENT";
const ROLE_USER = "ROLE_USER";

const DisplayUsers = () => {
  // State for users, loading, error, and pagination
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const limit = 10; // Number of users per page

  // State for popup
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUserRole, setNewUserRole] = useState("");

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

  // Function to fetch users with pagination and role-based filtering
  const fetchUsers = async (page) => {
    setLoading(true);
    setError(null);
    try {
      let url = `http://localhost/api/v1/users/list?page=${page}&limit=${limit}`;

      // Add role filters based on userRole
      if (userRole === ROLE_TEACHER) {
        // Assuming the API accepts multiple roles as separate query parameters
        url += `&roles=${ROLE_TEACHER}&roles=${ROLE_STUDENT}`;
      } else if (userRole === ROLE_STUDENT) {
        // If userRole is STUDENT, filter only teachers
        url += `&roles=${ROLE_TEACHER}`;
      }

      const response = await axios.get(url);
      let fetchedUsers = response.data.data;

      // Additional frontend filtering as a fallback
      if (userRole === ROLE_TEACHER) {
        fetchedUsers = fetchedUsers.filter(
          (user) => user.role === ROLE_TEACHER || user.role === ROLE_STUDENT
        );
      } else if (userRole === ROLE_STUDENT) {
        fetchedUsers = fetchedUsers.filter(
          (user) => user.role === ROLE_TEACHER
        );
      }

      setUsers(fetchedUsers);

      // Determine total pages based on filtered data
      const totalUsers =
        userRole === ROLE_TEACHER || userRole === ROLE_STUDENT
          ? fetchedUsers.length
          : response.data.total; // For admin, use the original total count
      setTotalPages(Math.ceil(totalUsers / limit));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when component mounts or when currentPage/userRole changes
  useEffect(() => {
    if (
      userRole === ROLE_ADMIN ||
      userRole === ROLE_TEACHER ||
      userRole === ROLE_STUDENT
    ) {
      fetchUsers(currentPage);
    }
  }, [currentPage, userRole]);

  // Function to verify a user (without API calls)
  const handleVerify = (userId) => {
    console.log(`Verify user with ID: ${userId}`);
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, isVerified: true } : user
      )
    );
  };

  // Function to handle role change with popup
  const handleChangeRole = (user, newRole) => {
    setSelectedUser(user);
    setNewUserRole(newRole);
    setIsPopupOpen(true);
  };

  // Function to confirm role change
  const confirmChangeRole = async () => {
    if (!selectedUser || !newUserRole) return;

    const token = localStorage.getItem("authToken"); // Retrieve token from localStorage

    try {
      const response = await axios.post(
        `http://localhost/api/v1/user/${selectedUser.id}/change_role`, // API endpoint
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
      console.error("Error while changing user role:", err);
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

  // Function to navigate to a specific page
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
  if (
    (userRole === ROLE_ADMIN ||
      userRole === ROLE_TEACHER ||
      userRole === ROLE_STUDENT) &&
    loading
  ) {
    return <p className="loading">Loading...</p>;
  }

  if (
    (userRole === ROLE_ADMIN ||
      userRole === ROLE_TEACHER ||
      userRole === ROLE_STUDENT) &&
    error
  ) {
    return <p className="error">Error: {error.message}</p>;
  }

  // Conditional rendering based on user role
  if (userRole === ROLE_USER) {
    return (
      <div className="access-denied">
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  // Render the user list for admin, teacher, and student
  return (
    <div className="container">
      <p className="myParagraphClass">User List in the System</p>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>First and Last Name</th>
            <th>Role</th>
            {/* Conditional rendering of headers */}
            {userRole === ROLE_ADMIN && (
              <>
                <th>Verified</th>
                <th>Action</th>
                <th>Change Role</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={userRole === ROLE_ADMIN ? "7" : "4"}>
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr key={user.id}>
                <td>{(currentPage - 1) * limit + index + 1}</td>
                <td style={{ fontWeight: "bold" }}>{user.email}</td>
                <td>{`${user.firstName} ${user.lastName}`}</td>
                <td>
                  {user.role.slice(5).charAt(0).toUpperCase() +
                    user.role.slice(6).toLowerCase()}
                </td>
                {/* Conditional rendering of cells */}
                {userRole === ROLE_ADMIN && (
                  <>
                    <td>{user.isVerified ? "Yes" : "No"}</td>
                    <td className="action-cell">
                      {user.isVerified ? (
                        <span>-</span>
                      ) : (
                        <button
                          className="VerifyButton"
                          onClick={() => handleVerify(user.id)}
                          aria-label={`Verify user ${user.email}`}
                        >
                          Verify
                        </button>
                      )}
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
                  </>
                )}
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
        {/* Render page numbers */}
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
    </div>
  );
};

export default DisplayUsers;
