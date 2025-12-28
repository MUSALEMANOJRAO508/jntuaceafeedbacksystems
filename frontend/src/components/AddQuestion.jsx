import { useEffect, useState } from "react";

export default function AddQuestions() {
  const [questionText, setQuestionText] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* ================= FETCH QUESTIONS ================= */
  const fetchQuestions = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/feedback/questions"
      );
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (err) {
      console.error("Fetch questions error:", err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  /* ================= ADD QUESTION ================= */
  const addQuestion = async () => {
    if (!questionText.trim()) {
      alert("Question text is required");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch(
        "http://localhost:5000/api/feedback/questions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ questionText })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(`❌ ${data.message}`);
      } else {
        setMessage("✅ Question added successfully");
        setQuestionText("");
        fetchQuestions(); // refresh list
      }
    } catch (err) {
      setMessage("❌ Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Add Feedback Questions</h2>

        <textarea
          placeholder="Enter feedback question"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          style={styles.textarea}
        />

        <button
          onClick={addQuestion}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "Adding..." : "Add Question"}
        </button>

        {message && <p style={styles.message}>{message}</p>}

        <hr />

        <h3>Existing Questions</h3>
        {questions.length === 0 && <p>No questions added yet</p>}

        <ul>
          {questions.map((q, index) => (
            <li key={q._id}>
              {index + 1}. {q.questionText}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "40px"
  },
  card: {
    width: "100%",
    maxWidth: "600px",
    background: "#fff",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
  },
  textarea: {
    width: "100%",
    minHeight: "80px",
    padding: "10px",
    marginBottom: "10px"
  },
  button: {
    padding: "10px 15px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  message: {
    marginTop: "10px",
    fontWeight: "bold"
  }
};
