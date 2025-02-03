import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext"; // Importuj kontekst powiadomień
import styled from "styled-components";
import apiConfig from "../../config";
import DashBoardAnnouncements from "./DashBoardAnnouncements";

const getUserName = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user.firstName + " " + user.lastName;
};

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
  animation: slide-in 0.5s ease-out, fade-out 0.5s 2.5s forwards;
`;

const DashBoard = () => {
  const { notification } = useNotification(); // Pobierz komunikat z kontekstu

  return (
    <>
      <div>
        <div style={{ marginLeft: "255px" }} className="hello-user">
          Hello, {getUserName()}
        </div>
      </div>
      {notification && (
        <SuccessNotification>
          <p>{notification}</p>
        </SuccessNotification>
      )}
      <div>
        <DashBoardAnnouncements></DashBoardAnnouncements>
      </div>
    </>
  );
};

export default DashBoard;
