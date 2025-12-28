import { useState } from "react";
import api from "../services/api";

export default function AdminLogin() {
  const [admission, setAdmission] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!admission || !password) {
      alert("Please enter Admin ID and password");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        admission,
        password
      });

      if (res.data.user.role !== "admin") {
        alert("❌ Access denied: You are not an admin");
        return;
      }

      localStorage.setItem("admin", JSON.stringify(res.data.user));
      alert("✅ Admin login successful");

      // ✅ REDIRECT TO ADMIN DASHBOARD
      window.location.href = "/admin";

    } catch (err) {
      alert("❌ Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Admin Login</h2>
        <p style={styles.subHeading}>College Feedback System</p>

        <input
          style={styles.input}
          placeholder="Admin ID"
          value={admission}
          onChange={(e) => setAdmission(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}

/* ================= FULL PAGE CSS ================= */
const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    fontFamily: "'Segoe UI', sans-serif"
  },
  card: {
    background: "#ffffff",
    padding: "35px",
    borderRadius: "15px",
    width: "100%",
    maxWidth: "380px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.3)",
    textAlign: "center"
  },
  heading: {
    marginBottom: "5px",
    color: "#333",
    fontSize: "24px"
  },
  subHeading: {
    marginBottom: "20px",
    color: "#666",
    fontSize: "14px"
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    outline: "none"
  },
  button: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #ff512f, #dd2476)",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "15px"
  }
};
