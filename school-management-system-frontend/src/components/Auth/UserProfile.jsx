import React, { useEffect, useState } from "react";
import { useAxios } from "../../utils/axiosInstance";

function UserProfile() {
  const axios = useAxios();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("user/me");
        setUserData(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUser();
  }, [axios]);

  if (error) return <div>Error: {error}</div>;
  if (!userData) return <div>Loading...</div>;

  return (
    <div>
      <h2>Profil użytkownika</h2>
      <p>ID: {userData.id}</p>
      <p>Email: {userData.email}</p>
      <p>Role: {userData.roles.join(", ")}</p>
    </div>
  );
}

export default UserProfile;
