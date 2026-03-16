import { useEffect, useState } from "react";
import Card from "../../components/Card";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  fetchSections,
  fetchCategoriesBySection,
  fetchSubjectsByCategory,
  createLesson,
} from "../../services/api";

export default function AdminLessons() {
  const [sections, setSections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({
    sectionId: "",
    categoryId: "",
    subjectId: "",
    title: "",
    importance: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSections()
      .then((res) => setSections(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!form.sectionId) return;
    fetchCategoriesBySection(form.sectionId).then((res) => setCategories(res.data));
  }, [form.sectionId]);

  useEffect(() => {
    if (!form.categoryId) return;
    fetchSubjectsByCategory(form.categoryId).then((res) => setSubjects(res.data));
  }, [form.categoryId]);

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    await createLesson({
      title: form.title,
      subjectId: form.subjectId,
      importance: form.importance,
      parts: [
        {
          title: form.title,
          text: form.importance,
          videos: [],
          images: [],
        },
      ],
    });
    setMessage("Lesson created");
    setForm({ ...form, title: "", importance: "" });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Manage Lessons</h1>
      <Card className="p-6 space-y-4">
        <form onSubmit={submit} className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <select
              className="border rounded-lg px-3 py-2"
              value={form.sectionId}
              onChange={(e) =>
                setForm({ ...form, sectionId: e.target.value, categoryId: "", subjectId: "" })
              }
              required
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
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value, subjectId: "" })}
              required
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              className="border rounded-lg px-3 py-2 sm:col-span-2"
              value={form.subjectId}
              onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
              required
            >
              <option value="">Select subject</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Lesson title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            className="w-full border rounded-lg px-3 py-2 min-h-[120px]"
            placeholder="Importance / description"
            value={form.importance}
            onChange={(e) => setForm({ ...form, importance: e.target.value })}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold"
          >
            Create Lesson
          </button>
          {message && <p className="text-green-600 text-sm">{message}</p>}
        </form>
      </Card>
    </main>
  );
}
