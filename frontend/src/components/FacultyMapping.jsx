import { useEffect, useState } from "react";
import api from "../services/api";

export default function FacultyMapping() {
  const [branch, setBranch] = useState("");
  const [regulation, setRegulation] = useState("");
  const [year, setYear] = useState("");          // number (1,2,3,4)
  const [semester, setSemester] = useState("");  // STRING "1-1"
  const [batchYear, setBatchYear] = useState("");

  const [subjects, setSubjects] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD FACULTY ================= */
  useEffect(() => {
    api
      .get("/admin/faculty")
      .then(res => setFaculty(res.data))
      .catch(err => console.error("Faculty load error", err));
  }, []);

  /* ================= LOAD SUBJECTS ================= */
  useEffect(() => {
    if (branch && regulation && year && semester) {
      setLoading(true);

      api
        .get(
          `/admin/subjects?branch=${branch}&regulation=${regulation}&year=${year}&semester=${semester}`
        )
        .then(res => {
          setSubjects(res.data.map(s => ({ ...s, facultyId: "" })));
        })
        .catch(err => {
          console.error("Subject fetch error", err.response?.data || err);
          setSubjects([]);
        })
        .finally(() => setLoading(false));
    }
  }, [branch, regulation, year, semester]);

  /* ================= SAVE MAPPING (BULK) ================= */
  const saveMapping = async () => {
    const mappings = subjects
      .filter(s => s.facultyId)
      .map(s => ({
        subjectId: s._id,
        facultyId: s.facultyId
      }));

    if (mappings.length === 0) {
      alert("⚠️ Please select at least one faculty");
      return;
    }

    try {
      const res = await api.post("/admin/map-subject-faculty", {
        branch,
        regulation,
        batchYear: Number(batchYear),
        semester,          // ✅ STRING like "1-1"
        mappings
      });

      alert(`✅ ${res.data.count} mappings saved successfully`);
    } catch (err) {
      console.error("Mapping error", err.response?.data || err);
      alert("❌ Error saving mappings");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>👨‍🏫 Faculty Mapping</h2>

        {/* FILTERS */}
        <div style={styles.grid}>
          <select style={styles.select} onChange={e => setBranch(e.target.value)}>
            <option value="">Branch</option>
            <option value="CSE">CSE</option>
          </select>

          <select style={styles.select} onChange={e => setRegulation(e.target.value)}>
            <option value="">Regulation</option>
            <option value="R20">R20</option>
            <option value="R21">R21</option>
            <option value="R22">R22</option>
            <option value="R23">R23</option>
          </select>

          <select style={styles.select} onChange={e => setBatchYear(e.target.value)}>
            <option value="">Batch Year</option>
            {[2021, 2022, 2023, 2024, 2025].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <select style={styles.select} onChange={e => setYear(e.target.value)}>
            <option value="">Year</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>

          {/* ✅ SEMESTER AS STRING */}
          <select style={styles.select} onChange={e => setSemester(e.target.value)}>
            <option value="">Semester</option>
            <option value="1-1">1-1</option>
            <option value="1-2">1-2</option>
            <option value="2-1">2-1</option>
            <option value="2-2">2-2</option>
            <option value="3-1">3-1</option>
            <option value="3-2">3-2</option>
            <option value="4-1">4-1</option>
            <option value="4-2">4-2</option>
          </select>
        </div>

        <hr />

        {loading && (
          <p style={{ textAlign: "center" }}>Loading subjects...</p>
        )}

        {!loading && subjects.length === 0 && (
          <p style={{ textAlign: "center", color: "#999" }}>
            No subjects found
          </p>
        )}

        {subjects.map(sub => (
          <div key={sub._id} style={styles.row}>
            <span style={styles.subject}>{sub.subjectName}</span>

            <select
              style={styles.select}
              value={sub.facultyId}
              onChange={e =>
                setSubjects(prev =>
                  prev.map(s =>
                    s._id === sub._id
                      ? { ...s, facultyId: e.target.value }
                      : s
                  )
                )
              }
            >
              <option value="">Select Faculty</option>
              {faculty.map(f => (
                <option key={f._id} value={f._id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        ))}

        <button
          style={styles.button}
          onClick={saveMapping}
          disabled={!subjects.some(s => s.facultyId)}
        >
          💾 Save Mapping
        </button>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#667eea,#764ba2)"
  },
  card: {
    background: "#fff",
    padding: 25,
    borderRadius: 12,
    width: "100%",
    maxWidth: 720,
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
  },
  title: {
    textAlign: "center",
    marginBottom: 20
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))",
    gap: 10
  },
  select: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc"
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },
  subject: {
    fontWeight: "bold"
  },
  button: {
    marginTop: 20,
    width: "100%",
    padding: 12,
    background: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "bold"
  }
};
