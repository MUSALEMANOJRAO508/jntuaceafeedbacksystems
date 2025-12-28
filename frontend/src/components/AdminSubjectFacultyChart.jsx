import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function AdminSubjectFacultyChart() {
  const [branch, setBranch] = useState("CSE");
  const [regulation, setRegulation] = useState("R20");
  const [batchYear, setBatchYear] = useState("2022");
  const [semester, setSemester] = useState("1-1");

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH DATA ================= */
  const fetchChartData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/subject-faculty-bar-chart?branch=${branch}&regulation=${regulation}&batchYear=${batchYear}&semester=${semester}`
      );
      const json = await res.json();
      setChartData(json.data || []);
    } catch (err) {
      alert("Failed to load chart data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  /* ================= CHART DATA ================= */
  const data = {
    labels: chartData.map(d => d.label),
    datasets: [
      {
        label: "Overall Feedback (%)",
        data: chartData.map(d => d.percentage),
        backgroundColor: "#4f46e5",
        borderRadius: 8
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.raw}%`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Percentage"
        }
      },
      x: {
        title: {
          display: true,
          text: "Subject (Faculty)"
        }
      }
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Faculty Feedback Bar Chart</h1>

      {/* FILTERS */}
      <div style={styles.filters}>
        <input value={branch} onChange={e => setBranch(e.target.value)} placeholder="Branch" />
        <input value={regulation} onChange={e => setRegulation(e.target.value)} placeholder="Regulation" />
        <input value={batchYear} onChange={e => setBatchYear(e.target.value)} placeholder="Batch Year" />
        <input value={semester} onChange={e => setSemester(e.target.value)} placeholder="Semester" />
        <button onClick={fetchChartData} style={styles.button}>Apply</button>
      </div>

      {/* CHART */}
      <div style={styles.chartBox}>
        {loading ? (
          <p>Loading...</p>
        ) : chartData.length === 0 ? (
          <p>No data available</p>
        ) : (
          <Bar data={data} options={options} />
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: {
    padding: "30px",
    background: "#f4f6ff",
    minHeight: "100vh"
  },
  title: {
    textAlign: "center",
    marginBottom: "25px"
  },
  filters: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "15px",
    marginBottom: "25px"
  },
  button: {
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  chartBox: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
  }
};
