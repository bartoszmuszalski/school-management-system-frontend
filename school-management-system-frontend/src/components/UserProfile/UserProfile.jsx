import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext"; // Importuj kontekst powiadomień
import styled from "styled-components";
import apiConfig from "../../config";
const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 20px auto;
  background-color: #f9f9f9;
`;

const ProfileTitle = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const ProfileInfo = styled.p`
  margin: 5px 0;
  font-size: 16px;
`;

const LoadingMessage = styled.p`
  font-style: italic;
  text-align: center;
`;

const SuccessNotification = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #4caf50;
  color: white;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const { getAuthToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const { notification } = useNotification(); // Pobierz komunikat z kontekstu

  useEffect(() => {
    const fetchUserData = async () => {
      const token = getAuthToken();
      if (!token) {
        console.error("Brak tokena autoryzacji.");
        return;
      }

      try {
        const response = await fetch(`${apiConfig.apiUrl}/api/v1/user/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const message = `${response.status}`;
          throw new Error(message);
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [getAuthToken]);

  return (
    <>
      <ProfileContainer>
        <ProfileTitle>Your Profile Information</ProfileTitle>
        {userData ? (
          <>
            <ProfileInfo>First name: {userData.firstName}</ProfileInfo>
            <ProfileInfo>Last name: {userData.lastName}</ProfileInfo>
            <ProfileInfo>Email: {userData.email}</ProfileInfo>
            <ProfileInfo>Role: {userData.roles}</ProfileInfo>
          </>
        ) : (
          <LoadingMessage>Ładowanie danych...</LoadingMessage>
        )}
      </ProfileContainer>
      {notification && (
        <SuccessNotification>
          <p>{notification}</p>
        </SuccessNotification>
      )}
    </>
  );
};

export default UserProfile;
