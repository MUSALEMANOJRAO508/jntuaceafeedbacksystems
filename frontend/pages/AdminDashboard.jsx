import ActivateFeedback from "../components/ActivateFeedback";
import AddQuestion from "../components/AddQuestion";
import FacultyMapping from "../components/FacultyMapping";

export default function AdminDashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>
      <ActivateFeedback />
      <AddQuestion />
      <FacultyMapping />
    </div>
  );
}
