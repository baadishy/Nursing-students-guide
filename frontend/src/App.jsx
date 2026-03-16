import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import LessonPage from "./pages/LessonPage";
import SubjectPage from "./pages/SubjectPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminLessons from "./pages/admin/AdminLessons";
import AdminSections from "./pages/admin/AdminSections";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminSubjects from "./pages/admin/AdminSubjects";
import AdminQuizzes from "./pages/admin/AdminQuizzes";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";

export default function App() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 text-foreground">
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subjects/:id"
          element={
            <ProtectedRoute>
              <SubjectPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lesson/:id"
          element={
            <ProtectedRoute>
              <LessonPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/sections"
          element={
            <ProtectedRoute>
              <AdminSections />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute>
              <AdminCategories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/subjects"
          element={
            <ProtectedRoute>
              <AdminSubjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/lessons"
          element={
            <ProtectedRoute>
              <AdminLessons />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/quizzes"
          element={
            <ProtectedRoute>
              <AdminQuizzes />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}
