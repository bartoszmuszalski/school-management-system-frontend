import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import logo from "../../components/Files/logo.png";

export default function LoginPage({ onLogin }) {
  const [verificationMessage, setVerificationMessage] = useState(null);
  const [fieldValues, setFieldValues] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get("verificationSuccess");

    if (success === "true") {
      setVerificationMessage("Użytkownik zweryfikowany!");
    } else {
      setVerificationMessage(null);
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`http://localhost/api/v1/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: fieldValues.email,
          password: fieldValues.password,
        }),
      });

      if (!response.ok) {
        let errorMessage = `Login failed: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage += ` ${errorData.message || ""}`;
        } catch (jsonError) {
          console.error("Failed to parse error JSON:", jsonError);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      handleLoginSuccess(data);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      console.error("Login Error:", error);
    }
  };

  const handleLoginSuccess = async (data) => {
    console.log("Login Success Data:", data);
    const token = data.token;
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

      const userResponseData = await response.json();
      onLogin(userResponseData, token);
    } catch (error) {
      setMessage("Błąd podczas pobierania danych użytkownika.");
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white mt-[100px] mx-auto max-w-[400px] lg:ml-[25%]">
      <div className="sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src={logo} // Use the imported local logo
          className="mx-auto h-20 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
        {verificationMessage && (
          <p className="mt-4 text-center text-sm text-green-600">
            {verificationMessage}
          </p>
        )}
      </div>

      <div className="mt-10 sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={fieldValues.email}
                onChange={handleChange}
                autoComplete="email"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <a
                  href="/reset-password"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={fieldValues.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {message && (
            <p className="text-center text-sm text-red-600">{message}</p>
          )}

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
