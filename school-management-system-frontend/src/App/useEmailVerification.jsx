// src/hooks/useEmailVerification.js
import { useState, useEffect, useContext } from "react";
import apiConfig from "../config";
import { AuthContext } from "../contexts/AuthContext";

const useEmailVerification = () => {
  const [isVerificationPopupOpen, setIsVerificationPopupOpen] = useState(false);
  const [emailVerificationLoading, setEmailVerificationLoading] =
    useState(false);
  const [emailVerificationError, setEmailVerificationError] = useState(null);
  const { isLoggedIn, user } = useContext(AuthContext);

  const openVerificationPopup = () => {
    setIsVerificationPopupOpen(true);
  };

  const closeVerificationPopup = () => {
    setIsVerificationPopupOpen(false);
  };

  const resendVerificationEmail = async () => {
    setEmailVerificationLoading(true);
    setEmailVerificationError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setEmailVerificationError("Authentication token not found.");
        setEmailVerificationLoading(false);
        return;
      }

      const response = await fetch(
        `${apiConfig.apiUrl}/api/v1/auth/resend-verification-email`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setEmailVerificationError(
          errorData.message || "Failed to resend verification email."
        );
      } else {
        // Optionally, show a success message
        // console.log("Verification email resent successfully.");
      }
    } catch (err) {
      setEmailVerificationError(
        "An error occurred while resending verification email."
      );
    } finally {
      setEmailVerificationLoading(false);
    }
  };

  useEffect(() => {
    const checkEmailVerification = async () => {
      if (isLoggedIn && user) {
        if (!user.emailVerified) {
          openVerificationPopup();
        }
      }
    };

    checkEmailVerification();
  }, [isLoggedIn, user]);

  return {
    isVerificationPopupOpen,
    openVerificationPopup,
    closeVerificationPopup,
    resendVerificationEmail,
    emailVerificationLoading,
    emailVerificationError,
  };
};

export default useEmailVerification;
