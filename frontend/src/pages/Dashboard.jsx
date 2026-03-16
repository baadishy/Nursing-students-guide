import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  fetchSections,
  fetchCategoriesBySection,
  fetchSubjectsByCategory,
} from "../services/api";
import Card from "../components/Card";
import LoadingSpinner from "../components/LoadingSpinner";
import { useLanguage } from "../contexts/LanguageContext";

export default function Dashboard() {
  const { lang } = useLanguage();
  const [params] = useSearchParams();
  const [sections, setSections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const sectionId = params.get("section");

  useEffect(() => {
    fetchSections()
      .then((res) => setSections(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!sectionId) return;
    fetchCategoriesBySection(sectionId).then((res) => setCategories(res.data));
  }, [sectionId]);

  useEffect(() => {
    if (!categories.length) return;
    Promise.all(categories.map((c) => fetchSubjectsByCategory(c._id))).then((all) =>
      setSubjects(
        all.flatMap((r, idx) => r.data.map((s) => ({ ...s, categoryId: categories[idx]._id }))),
      ),
    );
  }, [categories]);

  const selectedSection = useMemo(
    () => sections.find((s) => s._id === sectionId),
    [sections, sectionId],
  );

  if (loading) return <LoadingSpinner />;

  const browseList = selectedSection ? categories : sections;

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
          {lang === "ar" ? "لوحة الطالب" : "Student Dashboard"}
        </p>
        <h1 className="text-3xl font-black">
          {selectedSection ? selectedSection.name : lang === "ar" ? "اختر قسماً" : "Choose a section"}
        </h1>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {browseList.map((item) => {
          const relatedSubjects = selectedSection
            ? subjects.filter((s) => s.categoryIds?.includes(item._id))
            : [];
          return (
            <Card key={item._id} className="p-5 space-y-3">
              <h3 className="text-xl font-bold">{item.name}</h3>
              {item.description && (
                <p className="text-sm text-muted-foreground">{item.description}</p>
              )}
              {selectedSection && relatedSubjects.length ? (
                <div className="space-y-2">
                  {relatedSubjects.map((sub) => (
                    <Link
                      key={sub._id}
                      to={`/subjects/${sub._id}`}
                      className="block text-primary text-sm font-semibold"
                    >
                      {sub.name} →
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  to={`/dashboard?section=${item._id}`}
                  className="text-primary text-sm font-semibold inline-flex items-center gap-1"
                >
                  {lang === "ar" ? "استعراض" : "Explore"} →
                </Link>
              )}
            </Card>
          );
        })}
      </div>
    </main>
  );
}
