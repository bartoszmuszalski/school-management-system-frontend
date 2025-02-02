import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import styled from "styled-components";
import apiConfig from "../../config";

// Existing styled components
const ProfileContainer = styled.div`
  font-family: "Roboto Slab", serif;
  max-width: 800px;
  margin: 20px auto;
  padding: 40px;
  border-radius: 12px;
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 140px; /* Adjust for the sidebar width */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin: 0 auto;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
  }
`;

const ProfileTitle = styled.h2`
  font-family: "Roboto Slab", serif;
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background-color: #007bff;
    border-radius: 2px;
  }
`;

const ProfileInfo = styled.p`
  font-family: "Roboto Slab", serif;
  margin: 15px 0;
  font-size: 1.1rem;
  color: #555;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: "•";
    color: #007bff;
    font-size: 1.5rem;
  }
`;

const LoadingMessage = styled.p`
  font-family: "Roboto Slab", serif;
  font-style: italic;
  text-align: center;
  color: #777;
  font-size: 1.2rem;
`;

const ErrorMessage = styled.p`
  font-family: "Roboto Slab", serif;
  color: #ff4d4d;
  text-align: center;
  font-size: 1.1rem;
  margin-top: 20px;
`;

const SuccessNotification = styled.div`
  font-family: "Roboto Slab", serif;
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #4caf50;
  color: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: "✔";
    font-size: 1.2rem;
  }
`;

const ChangeEmailForm = styled.form`
  font-family: "Roboto Slab", serif;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  width: 100%;
  max-width: 500px;
`;

const ChangePasswordForm = styled.form`
  font-family: "Roboto Slab", serif;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  width: 100%;
  max-width: 500px;
`;

const FormTitle = styled.h3`
  font-family: "Roboto Slab", serif;
  text-align: center;
  margin-bottom: 15px;
  color: #333;
`;

const FormGroup = styled.div`
  font-family: "Roboto Slab", serif;
  margin-bottom: 15px;
`;

const FormLabel = styled.label`
  font-family: "Roboto Slab", serif;
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
`;

const FormInput = styled.input`
  font-family: "Roboto Slab", serif;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  width: 100%;
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const SubmitButton = styled.button`
  font-family: "Roboto Slab", serif;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  width: auto;
  font-weight: bold;
  &:hover {
    background-color: #0056b3;
  }
`;

// New styled components for modals and button container
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${(props) => (props.show ? 1 : 0)};
  pointer-events: ${(props) => (props.show ? "all" : "none")};
  transition: opacity 0.3s ease;
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  max-width: 500px;
  width: 90%;
  transform: ${(props) => (props.show ? "translateY(0)" : "translateY(-20px)")};
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: transform 0.3s ease, opacity 0.3s ease;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 20px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const { getAuthToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { notification, showNotification } = useNotification();
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = getAuthToken();
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${apiConfig.apiUrl}/api/v1/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            navigate("/login");
          } else {
            console.error("Failed to fetch user data", response.status);
          }
          return;
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [getAuthToken, navigate]);

  const handleEmailChange = async (e) => {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) {
      console.error("No authorization token.");
      return;
    }

    try {
      const response = await fetch(
        `${apiConfig.apiUrl}/api/v1/user/change_email`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: newEmail }),
        }
      );

      if (!response.ok) {
        const message = `${response.status}`;
        throw new Error(message);
      }

      // If response returns 204, log out the user.
      if (response.status === 204) {
        showNotification("Email changed successfully. Logging you out...");
        logout();
        return;
      }

      showNotification("Email changed successfully!");
      setNewEmail("");
      setShowEmailModal(false);
    } catch (error) {
      console.error("Error changing email:", error);
      showNotification(`Error changing email: ${error}`);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) {
      console.error("No authorization token.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      showNotification("New passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        `${apiConfig.apiUrl}/api/v1/user/change_password`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            newPasswordConfirmation: confirmNewPassword,
          }),
        }
      );

      if (!response.ok) {
        const message = `${response.status}`;
        throw new Error(message);
      }

      // If response returns 204, log out the user.
      if (response.status === 204) {
        showNotification("Password changed successfully. Logging you out...");
        logout();
        return;
      }

      showNotification("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setShowPasswordModal(false);
    } catch (error) {
      console.error("Error changing password:", error);
      showNotification(`Error changing password: ${error}`);
    }
  };

  return (
    <>
      <ProfileContainer>
        <ProfileTitle>Your profile information</ProfileTitle>
        {userData ? (
          <>
            {/* <ProfileInfo>First name: {userData.firstName}</ProfileInfo> */}
            <ProfileInfo>
              Name: {userData.firstName + " " + userData.lastName}
            </ProfileInfo>
            <ProfileInfo>Email: {userData.email}</ProfileInfo>
            <ProfileInfo>Role: {userData.roles}</ProfileInfo>
          </>
        ) : (
          <LoadingMessage>Loading data...</LoadingMessage>
        )}
      </ProfileContainer>

      {notification && (
        <SuccessNotification>
          <p>{notification}</p>
        </SuccessNotification>
      )}

      <ButtonContainer>
        <SubmitButton type="button" onClick={() => setShowEmailModal(true)}>
          Change email
        </SubmitButton>
        <SubmitButton type="button" onClick={() => setShowPasswordModal(true)}>
          Change password
        </SubmitButton>
      </ButtonContainer>

      {showEmailModal && (
        <ModalOverlay
          show={showEmailModal}
          onClick={() => setShowEmailModal(false)}
        >
          <ModalContent
            show={showEmailModal}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={() => setShowEmailModal(false)}>
              &times;
            </CloseButton>
            <ChangeEmailForm onSubmit={handleEmailChange}>
              <FormTitle>Change email</FormTitle>
              <FormGroup>
                <FormLabel htmlFor="newEmail">New email:</FormLabel>
                <FormInput
                  type="email"
                  id="newEmail"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </FormGroup>
              <SubmitButton type="submit">Change email</SubmitButton>
            </ChangeEmailForm>
          </ModalContent>
        </ModalOverlay>
      )}

      {showPasswordModal && (
        <ModalOverlay
          show={showPasswordModal}
          onClick={() => setShowPasswordModal(false)}
        >
          <ModalContent
            show={showPasswordModal}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={() => setShowPasswordModal(false)}>
              &times;
            </CloseButton>
            <ChangePasswordForm onSubmit={handlePasswordChange}>
              <FormTitle>Change password</FormTitle>
              <FormGroup>
                <FormLabel htmlFor="currentPassword">
                  Current password:
                </FormLabel>
                <FormInput
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="newPassword">New password:</FormLabel>
                <FormInput
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="confirmNewPassword">
                  Confirm new password:
                </FormLabel>
                <FormInput
                  type="password"
                  id="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </FormGroup>
              <SubmitButton type="submit">Change password</SubmitButton>
            </ChangePasswordForm>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default UserProfile;
