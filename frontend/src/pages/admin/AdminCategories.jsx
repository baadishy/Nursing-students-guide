import { useEffect, useState } from "react";
import Card from "../../components/Card";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  createCategory,
  fetchCategoriesBySection,
  fetchSections,
} from "../../services/api";

export default function AdminCategories() {
  const [sections, setSections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sectionId, setSectionId] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", order: 0 });

  useEffect(() => {
    fetchSections()
      .then((res) => setSections(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!sectionId) return;
    fetchCategoriesBySection(sectionId).then((res) => setCategories(res.data));
  }, [sectionId]);

  const submit = async (e) => {
    e.preventDefault();
    await createCategory({ ...form, sectionId });
    setForm({ name: "", description: "", order: 0 });
    fetchCategoriesBySection(sectionId).then((res) => setCategories(res.data));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Categories</h1>
      <Card className="p-5 space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <select
            className="border rounded-lg px-3 py-2"
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
          >
            <option value="">Select section</option>
            {sections.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        {sectionId && (
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
              Create Category
            </button>
          </form>
        )}
      </Card>

      {sectionId && (
        <Card className="p-5">
          <ul className="divide-y">
            {categories.map((c) => (
              <li key={c._id} className="py-2 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{c.name}</div>
                  {c.description && (
                    <div className="text-sm text-muted-foreground">{c.description}</div>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">Order {c.order ?? 0}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </main>
  );
}
