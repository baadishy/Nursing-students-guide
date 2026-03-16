import { useEffect, useState } from "react";
import Card from "../../components/Card";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  createSubject,
  fetchCategoriesBySection,
  fetchSections,
  fetchSubjectsByCategory,
} from "../../services/api";

export default function AdminSubjects() {
  const [sections, setSections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sectionId, setSectionId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "" });

  useEffect(() => {
    fetchSections()
      .then((res) => setSections(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!sectionId) return;
    fetchCategoriesBySection(sectionId).then((res) => setCategories(res.data));
    setCategoryId("");
  }, [sectionId]);

  useEffect(() => {
    if (!categoryId) return;
    fetchSubjectsByCategory(categoryId).then((res) => setSubjects(res.data));
  }, [categoryId]);

  const submit = async (e) => {
    e.preventDefault();
    await createSubject({
      name: form.name,
      description: form.description,
      categoryIds: [categoryId],
    });
    setForm({ name: "", description: "" });
    fetchSubjectsByCategory(categoryId).then((res) => setSubjects(res.data));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Subjects</h1>
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
          <select
            className="border rounded-lg px-3 py-2"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={!sectionId}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        {categoryId && (
          <form onSubmit={submit} className="grid sm:grid-cols-2 gap-3">
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
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold sm:col-span-2"
            >
              Create Subject
            </button>
          </form>
        )}
      </Card>
      {categoryId && (
        <Card className="p-5">
          <ul className="divide-y">
            {subjects.map((s) => (
              <li key={s._id} className="py-2">
                <div className="font-semibold">{s.name}</div>
                {s.description && (
                  <div className="text-sm text-muted-foreground">{s.description}</div>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </main>
  );
}
