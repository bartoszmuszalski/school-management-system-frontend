import React, { useState, useEffect, useRef } from "react";
import apiConfig from "../../config";
import "./TeacherSearchInput.css";

const TeacherSearchInput = ({
  editTeacherId,
  setEditTeacherId,
  searchPhrase,
  setEditTeacherName,
}) => {
  const [searchPhraseInput, setSearchPhrase] = useState(searchPhrase || "");
  const [teachers, setTeachers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  // Function to fetch teachers (moved out of useEffect for reusability)
  const fetchTeachers = async (searchPhrase) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(
        `${apiConfig.apiUrl}/api/v1/teachers/list?searchPhrase=${searchPhrase}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch teachers. Status: ${response.status}`);
      }

      const data = await response.json();
      setTeachers(data.data);
      setIsDropdownOpen(true); // Keep dropdown open after fetching
    } catch (err) {
      setError(err.message);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch teachers on initial focus or when searchPhraseInput changes
    if (isDropdownOpen) {
      fetchTeachers(searchPhraseInput);
    } else {
      setTeachers([]); // Clear teachers when dropdown is closed
    }
  }, [searchPhraseInput, isDropdownOpen]);

  const handleTeacherSelect = (teacherId) => {
    // Find the selected teacher by teacherId
    const selectedTeacher = teachers.find(
      (teacher) => teacher.teacherId === teacherId // Ensure you're using the correct property here
    );

    if (selectedTeacher) {
      setSearchPhrase(
        `${selectedTeacher.firstName} ${selectedTeacher.lastName}`
      );
      setEditTeacherName(
        `${selectedTeacher.firstName} ${selectedTeacher.lastName}`
      );
    }

    setEditTeacherId(selectedTeacher?.teacherId); // Set the teacherId to the parent component's state
    setIsDropdownOpen(false); // Close the dropdown after selecting
  };

  useEffect(() => {
    // Close the dropdown if user clicks outside of it
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="teacher-search-container" ref={dropdownRef}>
      <input
        type="text"
        placeholder="Search for a teacher..."
        value={searchPhraseInput}
        onChange={(e) => setSearchPhrase(e.target.value)}
        onFocus={() => setIsDropdownOpen(true)} // Open dropdown on focus
        className="teacher-search-input"
      />
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {isDropdownOpen && teachers.length > 0 && (
        <ul className="teacher-dropdown">
          {teachers.map((teacher) => (
            <li
              key={teacher.teacherId} // Using teacherId for uniqueness
              onClick={() => handleTeacherSelect(teacher.teacherId)} // Handle teacher selection
            >
              {teacher.firstName} {teacher.lastName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TeacherSearchInput;
