import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import styled from "styled-components";

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

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const { getAuthToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = getAuthToken();
      if (!token) {
        console.error("Brak tokena autoryzacji.");
        return;
      }
      try {
        const response = await fetch(`http://localhost/api/v1/user/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const message = `Wystąpił błąd: ${response.status}`;
          throw new Error(message);
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Błąd pobierania danych użytkownika:", error);
      }
    };

    fetchUserData();
  }, [getAuthToken]);

  return (
    <ProfileContainer>
      <ProfileTitle>Your Profile Information</ProfileTitle>
      {userData ? (
        <>
          <ProfileInfo>First name: {userData.firstName}</ProfileInfo>
          <ProfileInfo>Last name: {userData.lastName}</ProfileInfo>
          <ProfileInfo>Email: {userData.email}</ProfileInfo>
          <ProfileInfo>Role: {userData.roles}</ProfileInfo>
          {/*handleResetPassword*/}
        </>
      ) : (
        <LoadingMessage>Ładowanie danych...</LoadingMessage>
      )}
    </ProfileContainer>
  );
};

export default UserProfile;
