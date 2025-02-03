import React, { useState, useEffect, useRef } from "react";
import apiConfig from "../../config";
import "./TeacherSearchInput.css";

const TeacherSearchInput = ({
  teacherName,
  setEditTeacherId,
  setEditTeacherName,
}) => {
  const [searchPhraseInput, setSearchPhrase] = useState(teacherName || "");
  const [teachers, setTeachers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setSearchPhrase(teacherName || ""); // Ustaw pusty ciąg, jeśli teacherName jest null
  }, [teacherName]);

  const fetchTeachers = async (phrase) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(
        `${apiConfig.apiUrl}/api/v1/teachers/list?searchPhrase=${phrase}`,
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
      setIsDropdownOpen(true);
    } catch (err) {
      setError(err.message);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen && searchPhraseInput.trim()) {
      fetchTeachers(searchPhraseInput);
    } else {
      setTeachers([]); // Wyczyść listę nauczycieli, jeśli pole wyszukiwania jest puste
    }
  }, [searchPhraseInput, isDropdownOpen]);

  const handleTeacherSelect = (teacherId) => {
    const selectedTeacher = teachers.find(
      (teacher) => teacher.teacherId === teacherId
    );
    if (selectedTeacher) {
      const fullName = `${selectedTeacher.firstName} ${selectedTeacher.lastName}`;
      setSearchPhrase(fullName);
      setEditTeacherName(fullName);
      setEditTeacherId(selectedTeacher.teacherId); // Ustaw ID nauczyciela
      console.log("Teacher selected, teacherId:", teacherId);
    } else {
      setEditTeacherId(null); // Ustaw na null, jeśli nauczyciel nie został znaleziony
    }
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="teacher-search-container" ref={dropdownRef}>
      <input
        type="text"
        placeholder="Search for a teacher..."
        value={searchPhraseInput}
        onChange={(e) => {
          setSearchPhrase(e.target.value);
          if (!e.target.value.trim()) {
            setEditTeacherId(null); // Resetuj teacherId do null, jeśli pole jest puste
            setEditTeacherName("");
          }
        }}
        onFocus={() => setIsDropdownOpen(true)}
        className="teacher-search-input"
      />
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {isDropdownOpen && teachers.length > 0 && (
        <ul className="teacher-dropdown">
          {teachers.map((teacher) => (
            <li
              key={teacher.teacherId}
              onClick={() => handleTeacherSelect(teacher.teacherId)}
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
