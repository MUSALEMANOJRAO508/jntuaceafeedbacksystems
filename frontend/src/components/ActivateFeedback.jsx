import { useState } from "react";

export default function ActivateFeedback() {
  const [formData, setFormData] = useState({
    branch: "",
    regulation: "",
    batchYear: "",
    semester: "", // ✅ STRING
    startTime: "",
    endTime: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        "http://localhost:5000/api/feedback/activate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            branch: formData.branch,
            regulation: formData.regulation,
            batchYear: Number(formData.batchYear), // ✅ NUMBER
            semester: formData.semester,           // ✅ STRING (IMPORTANT)
            startTime: formData.startTime,
            endTime: formData.endTime
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(`❌ ${data.message}`);
      } else {
        setMessage("✅ Feedback activated successfully");
        setFormData({
          branch: "",
          regulation: "",
          batchYear: "",
          semester: "",
          startTime: "",
          endTime: ""
        });
      }
    } catch (error) {
      setMessage("❌ Server error");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Activate Feedback</h2>

        <form onSubmit={handleSubmit}>
          {/* Branch */}
          <select
            name="branch"
            required
            value={formData.branch}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select Branch</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="MECH">MECH</option>
            <option value="CIVIL">CIVIL</option>
          </select>

          {/* Regulation */}
          <select
            name="regulation"
            required
            value={formData.regulation}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select Regulation</option>
            <option value="R19">R19</option>
            <option value="R20">R20</option>
            <option value="R23">R23</option>
          </select>

          {/* Batch Year */}
          <select
            name="batchYear"
            required
            value={formData.batchYear}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select Batch Year</option>
            {[2021, 2022, 2023, 2024, 2025].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          {/* Semester (STRING VALUES) */}
          <select
            name="semester"
            required
            value={formData.semester}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select Semester</option>
            <option value="1-1">1-1</option>
            <option value="1-2">1-2</option>
            <option value="2-1">2-1</option>
            <option value="2-2">2-2</option>
            <option value="3-1">3-1</option>
            <option value="3-2">3-2</option>
            <option value="4-1">4-1</option>
            <option value="4-2">4-2</option>
          </select>

          {/* Start Time */}
          <label style={styles.label}>From</label>
          <input
            type="datetime-local"
            name="startTime"
            required
            value={formData.startTime}
            onChange={handleChange}
            style={styles.input}
          />

          {/* End Time */}
          <label style={styles.label}>To</label>
          <input
            type="datetime-local"
            name="endTime"
            required
            value={formData.endTime}
            onChange={handleChange}
            style={styles.input}
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Activating..." : "Activate Feedback"}
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}
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
    maxWidth: "460px",
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.15)"
  },
  title: {
    textAlign: "center",
    marginBottom: "20px"
  },
  label: {
    fontSize: "14px",
    fontWeight: "bold"
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  message: {
    marginTop: "15px",
    textAlign: "center",
    fontWeight: "bold"
  }
};
