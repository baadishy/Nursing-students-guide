import { useEffect, useState } from "react";
import { fetchSections } from "../services/api";
import Card from "../components/Card";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

export default function Home() {
  const { lang } = useLanguage();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSections()
      .then((res) => setSections(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <section className="text-center space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-primary/80 font-semibold">
          {lang === "ar" ? "دليل الطلاب" : "Student Guide"}
        </p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          {lang === "ar" ? "أقسام التعلم" : "Learning Sections"}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {lang === "ar"
            ? "اختر القسم لعرض المحتوى والاختبارات"
            : "Pick a section to explore lessons and quizzes."}
        </p>
      </section>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Card key={section._id} className="p-6 space-y-3 hover:-translate-y-1 transition">
            <div className="text-xs font-semibold text-primary/80">
              {lang === "ar" ? "قسم" : "Section"}
            </div>
            <h3 className="text-xl font-bold">{section.name}</h3>
            {section.description && (
              <p className="text-sm text-muted-foreground">{section.description}</p>
            )}
            <Link
              to={`/dashboard?section=${section._id}`}
              className="inline-flex text-sm text-primary font-semibold"
            >
              {lang === "ar" ? "عرض المحتوى" : "View content"} →
            </Link>
          </Card>
        ))}
      </div>
    </main>
  );
}
