import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import StudentLogin from "./pages/StudentLogin";
import StudentFeedback from "./pages/StudentFeedback";
import Register from "./components/Register";

export default function App() {
  const path = window.location.pathname;

  if (path === "/admin") return <AdminDashboard />;
  if (path === "/student") return <StudentLogin />;
  if (path === "/student-feedback") return <StudentFeedback />;
  if (path === "/register") return <Register />;
  if (path === "/login") return <AdminLogin/>
  // 👇 DEFAULT PAGE → REGISTER
  return <Register />;
}
