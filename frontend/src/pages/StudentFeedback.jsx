import { useEffect, useState } from "react";

export default function StudentFeedback() {
  const student = JSON.parse(localStorage.getItem("student"));
  const admission = student?.admission;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!admission) {
      setError("Please login first");
      setLoading(false);
      return;
    }

    fetch(
  `${import.meta.env.VITE_API_URL}/api/student/feedback-data?admission=${admission}`
)
      .then(res => res.json())
      .then(result => {
        if (!result.active) {
          setError(result.message || "Feedback not activated");
        } else {
          setData(result);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Server error");
        setLoading(false);
      });
  }, [admission]);

  if (loading) return <h3 style={styles.center}>Loading...</h3>;
  if (error) return <h3 style={{ ...styles.center, color: "red" }}>{error}</h3>;

  return (
    <div style={styles.page}>
      <h1>Student Feedback Form</h1>

      {/* STUDENT DETAILS */}
      <div style={styles.card}>
        <p><b>Admission:</b> {data.student.admission}</p>
        <p><b>Branch:</b> {data.student.branch}</p>
        <p><b>Semester:</b> {data.activation.semester}</p>
      </div>

      {/* SUBJECTS */}
      <div style={styles.card}>
        <h3>Subjects</h3>
        {data.subjects.map((s, i) => (
          <p key={s.subjectId}>
            {i + 1}. {s.subjectName} — {s.facultyName}
          </p>
        ))}
      </div>

      {/* QUESTIONS */}
      <div style={styles.card}>
        <h3>Questions</h3>
        {data.questions.map((q, i) => (
          <p key={q._id}>
            {i + 1}. {q.questionText}
          </p>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "30px",
    background: "#f4f6ff"
  },
  center: {
    textAlign: "center",
    marginTop: "100px"
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px"
  }
};
