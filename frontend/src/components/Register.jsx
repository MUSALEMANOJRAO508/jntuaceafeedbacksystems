import { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    admission: "",
    regulation: "",
    batchYear: "",
    password: "",
    role: "student"
  });

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

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          batchYear: Number(formData.batchYear)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      alert("✅ Registration successful");

      // ✅ REDIRECT TO STUDENT LOGIN PAGE
      window.location.href = "/student";

    } catch (error) {
      console.error(error);
      alert("❌ Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}></div>

      <form style={styles.card} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Student Registration</h2>
        <p style={styles.subtitle}>Create your account</p>

        <input
          style={styles.input}
          type="text"
          name="name"
          placeholder="👤 Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          style={styles.input}
          type="text"
          name="admission"
          placeholder="🎓 Admission Number"
          value={formData.admission}
          onChange={handleChange}
          required
        />

        <select
          style={styles.input}
          name="regulation"
          value={formData.regulation}
          onChange={handleChange}
          required
        >
          <option value="">📘 Regulation</option>
          <option value="R19">R19</option>
          <option value="R20">R20</option>
          <option value="R23">R23</option>
        </select>

        <select
          style={styles.input}
          name="batchYear"
          value={formData.batchYear}
          onChange={handleChange}
          required
        >
          <option value="">📅 Batch Year</option>
          {[2021, 2022, 2023, 2024, 2025].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="🔒 Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

/* ================= FULL PAGE CENTER CSS ================= */
const styles = {
  page: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(120deg, #1e3c72, #2a5298, #667eea)",
    fontFamily: "'Segoe UI', sans-serif",
    position: "relative"
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.25)"
  },

  card: {
    position: "relative",
    zIndex: 1,
    background: "#ffffff",
    padding: "35px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.35)"
  },

  title: {
    textAlign: "center",
    fontSize: "26px",
    marginBottom: "6px",
    color: "#1e3c72"
  },

  subtitle: {
    textAlign: "center",
    marginBottom: "25px",
    color: "#555",
    fontSize: "14px"
  },

  input: {
    width: "100%",
    padding: "13px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
    outline: "none"
  },

  button: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer"
  }
};
