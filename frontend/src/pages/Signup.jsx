import { useState } from "react";
import { signup } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    grade: "",
    governorate: "",
    classNumber: "",
    schoolName: "",
  });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    try {
      const res = await signup(form);
      setMsg(res.data.message || "Registered. Await approval.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      setErr(error.response?.data?.message || "Signup failed");
    }
  };

  const field = (name, placeholder, type = "text") => (
    <input
      key={name}
      className="w-full border rounded-lg px-3 py-2"
      type={type}
      placeholder={placeholder}
      value={form[name]}
      onChange={(e) => setForm({ ...form, [name]: e.target.value })}
      required
    />
  );

  return (
    <main className="max-w-lg mx-auto px-4 py-10">
      <div className="text-center space-y-2 mb-6">
        <img src="/logo.png" alt="logo" className="h-14 w-14 mx-auto" />
        <h1 className="text-2xl font-bold">Create Account</h1>
      </div>
      <form onSubmit={submit} className="space-y-3">
        {field("name", "Student Name")}
        {field("grade", "Grade (1st / 2nd / 3rd)")}
        {field("governorate", "Governorate")}
        {field("classNumber", "Class Number")}
        {field("schoolName", "School Name")}
        {err && <p className="text-sm text-destructive">{err}</p>}
        {msg && <p className="text-sm text-green-600">{msg}</p>}
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-semibold"
        >
          Sign up
        </button>
      </form>
    </main>
  );
}
