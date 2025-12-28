import { useState } from "react";

export default function App() {
  const [admission, setAdmission] = useState("");
  const [password, setPassword] = useState("");

  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [data, setData] = useState(null);

  const [branch, setBranch] = useState("");
  const [regulation, setRegulation] = useState("");
  const [semester, setSemester] = useState("");
  const [batchYear, setBatchYear] = useState("");

  const [responses, setResponses] = useState({});

  /* ================= LOGIN ================= */
  const handleLogin = async () => {
    if (!admission || !password) {
      setError("Enter admission number and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admission, password })
      });

      const loginData = await res.json();
      if (!res.ok) {
        setError(loginData.message || "Login failed");
        return;
      }

      setBatchYear(Number(`20${admission.substring(0, 2)}`));

      const feedbackRes = await fetch(
        `http://localhost:5000/api/student/feedback-data?admission=${admission}`
      );
      const feedbackData = await feedbackRes.json();

      if (!feedbackData.active) {
        setError(feedbackData.message || "Feedback not activated");
        return;
      }

      setBranch(feedbackData.student.branch);
      setRegulation(feedbackData.student.regulation);
      setSemester(feedbackData.activation.semester);

      setData(feedbackData);
      setLoggedIn(true);
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RATING ================= */
  const handleRatingChange = (subjectId, qKey, value) => {
    setResponses(prev => ({
      ...prev,
      [subjectId]: {
        ...(prev[subjectId] || {}),
        [qKey]: Number(value)
      }
    }));
  };

  const isFormComplete = () =>
    data &&
    data.subjects.every(sub =>
      ["q1", "q2", "q3"].every(q => responses[sub.subjectId]?.[q])
    );

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    const payload = {
      admission,
      branch,
      regulation,
      batchYear,
      semester,
      responses
    };

    try {
      const res = await fetch("http://localhost:5000/api/feedback/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (!res.ok) {
        alert(result.message);
        return;
      }

      alert("✅ Feedback submitted successfully");
      setLoggedIn(false);
      setData(null);
      setResponses({});
    } catch {
      alert("❌ Server error");
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.mainTitle}>Student Feedback System</h1>

      {!loggedIn && (
        <div style={styles.loginWrapper}>
          <div style={styles.loginCard}>
            <h2 style={styles.cardTitle}>Student Login</h2>

            <input
              style={styles.input}
              placeholder="Admission Number"
              value={admission}
              onChange={e => setAdmission(e.target.value)}
            />

            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <button style={styles.button} onClick={handleLogin} disabled={loading}>
              {loading ? "Please wait..." : "Login"}
            </button>

            {error && <p style={styles.error}>{error}</p>}
          </div>
        </div>
      )}

      {loggedIn && data && (
        <div style={styles.formCard}>
          <div style={styles.infoGrid}>
            <div><b>Admission:</b> {admission}</div>
            <div><b>Branch:</b> {branch}</div>
            <div><b>Regulation:</b> {regulation}</div>
            <div><b>Batch:</b> {batchYear}</div>
            <div><b>Semester:</b> {semester}</div>
          </div>

          {data.subjects.map(subject => (
            <div key={subject.subjectId} style={styles.subjectBox}>
              <h3>{subject.subjectName}</h3>
              <p style={styles.faculty}>
                Faculty: {subject.facultyName}
              </p>

              <div style={styles.questionGrid}>
                {["q1", "q2", "q3"].map((qKey, idx) => (
                  <div key={qKey}>
                    <p>Question {idx + 1}</p>
                    <select
                      style={styles.select}
                      value={responses[subject.subjectId]?.[qKey] || ""}
                      onChange={e =>
                        handleRatingChange(
                          subject.subjectId,
                          qKey,
                          e.target.value
                        )
                      }
                    >
                      <option value="">Select Rating</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            style={{
              ...styles.submitButton,
              opacity: isFormComplete() ? 1 : 0.6
            }}
            disabled={!isFormComplete()}
            onClick={handleSubmit}
          >
            ✅ Submit Feedback
          </button>
        </div>
      )}
    </div>
  );
}

/* ================= COLORFUL FULL-SCREEN CSS ================= */
const styles = {
  page: {
    minHeight: "100vh",
    width: "100vw",
    background:
      "radial-gradient(circle at top left, #22c55e, #3b82f6, #9333ea, #ec4899)",
    padding: "40px",
    boxSizing: "border-box",
    fontFamily: "'Segoe UI', sans-serif"
  },

  mainTitle: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: "40px",
    marginBottom: "40px",
    letterSpacing: "1px",
    textShadow: "0 4px 10px rgba(0,0,0,0.4)"
  },

  loginWrapper: {
    display: "flex",
    justifyContent: "center"
  },

  loginCard: {
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(10px)",
    padding: "40px",
    borderRadius: "24px",
    width: "420px",
    boxShadow: "0 30px 80px rgba(0,0,0,0.35)"
  },

  cardTitle: {
    textAlign: "center",
    marginBottom: "25px",
    fontSize: "22px"
  },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "16px",
    fontSize: "16px",
    borderRadius: "12px",
    border: "1px solid #ccc"
  },

  button: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg,#4f46e5,#22c55e)",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontSize: "16px",
    cursor: "pointer"
  },

  formCard: {
    width: "100%",
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(8px)",
    padding: "45px",
    borderRadius: "26px",
    boxShadow: "0 35px 90px rgba(0,0,0,0.4)"
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "20px",
    background: "linear-gradient(135deg,#e0e7ff,#f0fdf4)",
    padding: "22px",
    borderRadius: "16px",
    marginBottom: "35px"
  },

  subjectBox: {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "22px",
    marginBottom: "35px",
    boxShadow: "0 12px 25px rgba(0,0,0,0.15)"
  },

  faculty: {
    color: "#6b7280",
    marginBottom: "20px"
  },

  questionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "25px"
  },

  select: {
    width: "100%",
    padding: "12px",
    fontSize: "15px",
    borderRadius: "10px",
    border: "1px solid #c7d2fe"
  },

  submitButton: {
    width: "100%",
    padding: "18px",
    fontSize: "20px",
    background: "linear-gradient(135deg,#16a34a,#22c55e)",
    color: "#fff",
    border: "none",
    borderRadius: "18px",
    cursor: "pointer"
  },

  error: {
    color: "#dc2626",
    marginTop: "15px",
    textAlign: "center",
    fontWeight: "600"
  }
};
