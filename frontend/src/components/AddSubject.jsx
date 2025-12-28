import { useState } from "react";
import api from "../services/api";

export default function AddSubject() {
  const [branch, setBranch] = useState("");
  const [regulation, setRegulation] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");

  const [subjects, setSubjects] = useState([
    { subjectCode: "", subjectName: "" }
  ]);

  const addRow = () => {
    setSubjects([...subjects, { subjectCode: "", subjectName: "" }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = value;
    setSubjects(updated);
  };

  const submit = async () => {
    if (!branch || !regulation || !year || !semester) {
      alert("Select branch, regulation, year and semester");
      return;
    }

    if (subjects.some(s => !s.subjectCode || !s.subjectName)) {
      alert("Fill all subject fields");
      return;
    }

    try {
      await api.post("/admin/add-subjects", {
        branch,
        regulation,
        year: Number(year),
        semester,
        subjects
      });

      alert("Subjects added successfully");
      setSubjects([{ subjectCode: "", subjectName: "" }]);
    } catch (err) {
      console.error(err);
      alert("Error adding subjects");
    }
  };

  return (
    <div className="subject-page">
      <style>{`
        .subject-page {
          min-height: 100vh;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #43cea2, #185a9d);
          font-family: 'Segoe UI', sans-serif;
        }

        .subject-card {
          background: #fff;
          width: 700px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          animation: slideUp 0.6s ease;
        }

        .subject-card h3 {
          text-align: center;
          margin-bottom: 20px;
          font-size: 22px;
          color: #333;
        }

        .subject-card select,
        .subject-card input {
          width: 100%;
          padding: 12px 14px;
          margin-bottom: 14px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .subject-card select:focus,
        .subject-card input:focus {
          outline: none;
          border-color: #43cea2;
          box-shadow: 0 0 0 2px rgba(67,206,162,0.2);
        }

        .subject-row {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }

        .subject-row input {
          flex: 1;
        }

        .subject-card button {
          padding: 12px 16px;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .add-btn {
          background: #f1f5f9;
          color: #333;
          margin-bottom: 20px;
        }

        .add-btn:hover {
          background: #e2e8f0;
        }

        .save-btn {
          width: 100%;
          background: linear-gradient(135deg, #43cea2, #185a9d);
          color: #fff;
        }

        .save-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }

        .subject-card hr {
          margin: 20px 0;
          border: none;
          border-top: 1px solid #eee;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="subject-card">
        <h3>Add Subjects</h3>

        <select onChange={e => setBranch(e.target.value)}>
          <option value="">Branch</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
        </select>

        <select onChange={e => setRegulation(e.target.value)}>
          <option value="">Regulation</option>
          <option value="R20">R20</option>
          <option value="R21">R21</option>
          <option value="R23">R23</option>
        </select>

        <select onChange={e => setYear(e.target.value)}>
          <option value="">Year</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>

        <select onChange={e => setSemester(e.target.value)}>
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

        <hr />

        {subjects.map((s, index) => (
          <div key={index} className="subject-row">
            <input
              placeholder="Subject Code"
              value={s.subjectCode}
              onChange={e => handleChange(index, "subjectCode", e.target.value)}
            />
            <input
              placeholder="Subject Name"
              value={s.subjectName}
              onChange={e => handleChange(index, "subjectName", e.target.value)}
            />
          </div>
        ))}

        <button className="add-btn" onClick={addRow}>
          + Add Another Subject
        </button>

        <button className="save-btn" onClick={submit}>
          Save Subjects
        </button>

        <hr />
      </div>
    </div>
  );
}
