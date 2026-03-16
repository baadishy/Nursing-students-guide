import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ name: "", id: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login({ name: form.name, id: form.id });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 py-10">
      <div className="text-center space-y-2 mb-6">
        <img src="/logo.png" alt="logo" className="h-14 w-14 mx-auto" />
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="text-sm text-muted-foreground">Enter your name and MongoDB ID</p>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <input
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="w-full border rounded-lg px-3 py-2"
          placeholder="MongoDB ID"
          value={form.id}
          onChange={(e) => setForm({ ...form, id: e.target.value })}
          required
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-semibold"
        >
          Login
        </button>
      </form>
    </main>
  );
}
