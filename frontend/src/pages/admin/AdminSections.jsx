import { useEffect, useState } from "react";
import Card from "../../components/Card";
import LoadingSpinner from "../../components/LoadingSpinner";
import { createSection, fetchSections } from "../../services/api";

export default function AdminSections() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", order: 0 });

  const load = () =>
    fetchSections()
      .then((res) => setSections(res.data))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await createSection(form);
    setForm({ name: "", description: "", order: 0 });
    load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Sections</h1>
      <Card className="p-5 space-y-4">
        <form onSubmit={submit} className="grid sm:grid-cols-3 gap-3">
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            type="number"
            className="border rounded-lg px-3 py-2"
            placeholder="Order"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold sm:col-span-3"
          >
            Create Section
          </button>
        </form>
      </Card>
      <Card className="p-5">
        <ul className="divide-y">
          {sections.map((s) => (
            <li key={s._id} className="py-2 flex items-center justify-between">
              <div>
                <div className="font-semibold">{s.name}</div>
                {s.description && (
                  <div className="text-sm text-muted-foreground">{s.description}</div>
                )}
              </div>
              <span className="text-xs text-muted-foreground">Order {s.order ?? 0}</span>
            </li>
          ))}
        </ul>
      </Card>
    </main>
  );
}
