import { useState } from "react";

import AddFaculty from "../components/AddFaculty";
import AddSubject from "../components/AddSubject";
import FacultyMapping from "../components/FacultyMapping";
import AddQuestion from "../components/AddQuestion";
import ActivateFeedback from "../components/ActivateFeedback";
import AdminSubjectFacultyChart from "../components/AdminSubjectFacultyChart";


export default function AdminDashboard() {
  const [active, setActive] = useState("faculty");

  const renderComponent = () => {
    switch (active) {
      case "faculty":
        return <AddFaculty />;
      case "subject":
        return <AddSubject />;
      case "mapping":
        return <FacultyMapping />;
      case "question":
        return <AddQuestion />;
      case "activate":
        return <ActivateFeedback />;
      case "chart":
        return <AdminSubjectFacultyChart />;
      default:
        return <AddFaculty />;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Admin Panel</h2>

        <button style={styles.btn} onClick={() => setActive("faculty")}>
          👨‍🏫 Add Faculty
        </button>

        <button style={styles.btn} onClick={() => setActive("subject")}>
          📘 Add Subject
        </button>

        <button style={styles.btn} onClick={() => setActive("mapping")}>
          🔗 Faculty Mapping
        </button>

        <button style={styles.btn} onClick={() => setActive("question")}>
          ❓ Add Questions
        </button>

        <button style={styles.btn} onClick={() => setActive("activate")}>
          ⏰ Activate Feedback
        </button>

        <button style={styles.btn} onClick={() => setActive("chart")}>
          📊 Feedback Analysis
        </button>
      </div>

      <div style={styles.content}>
        {renderComponent()}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    background: "linear-gradient(to right, #e0f2fe, #f0f9ff)"
  },
  sidebar: {
    width: "260px",
    background: "linear-gradient(180deg, #2563eb, #1e40af)",
    padding: "20px",
    color: "#fff"
  },
  logo: {
    textAlign: "center",
    marginBottom: "30px"
  },
  btn: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#3b82f6",
    color: "#fff",
    fontSize: "15px",
    cursor: "pointer"
  },
  content: {
    flex: 1,
    padding: "30px",
    background: "#f8fafc",
    borderTopLeftRadius: "20px"
  }
};
