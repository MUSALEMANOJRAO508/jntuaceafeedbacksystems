import { useState } from "react";
import api from "../services/api";

export default function AddFaculty() {
  const [form, setForm] = useState({
    facultyId: "",
    name: "",
    department: "",
    designation: "",
    email: "",
    phone: "",
    status: "Active"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    try {
      await api.post("/admin/add-faculty", form);
      alert("Faculty added");
      setForm({
        facultyId: "",
        name: "",
        department: "",
        designation: "",
        email: "",
        phone: "",
        status: "Active"
      });
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="faculty-page">
      <style>{`
        .faculty-page {
          min-height: 100vh;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #667eea, #764ba2);
          font-family: 'Segoe UI', sans-serif;
        }

        .faculty-card {
          background: #ffffff;
          width: 420px;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          animation: fadeIn 0.6s ease-in-out;
        }

        .faculty-card h3 {
          text-align: center;
          margin-bottom: 20px;
          color: #333;
          font-size: 22px;
        }

        .faculty-card input,
        .faculty-card select {
          width: 100%;
          padding: 12px 14px;
          margin-bottom: 14px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .faculty-card input:focus,
        .faculty-card select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
        }

        .faculty-card button {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .faculty-card button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .faculty-card hr {
          margin-top: 20px;
          border: none;
          border-top: 1px solid #eee;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="faculty-card">
        <h3>Add Faculty</h3>

        <input name="facultyId" placeholder="Faculty ID" onChange={handleChange} />
        <input name="name" placeholder="Faculty Name" onChange={handleChange} />
        <input name="department" placeholder="Department (CSE/ECE)" onChange={handleChange} />
        <input name="designation" placeholder="Designation" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="phone" placeholder="Phone" onChange={handleChange} />

        <select name="status" onChange={handleChange}>
          <option>Active</option>
          <option>Inactive</option>
        </select>

        <button onClick={submit}>Add Faculty</button>
        <hr />
      </div>
    </div>
  );
}
