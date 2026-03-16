import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchLesson, fetchQuizByLesson } from "../services/api";
import Card from "../components/Card";
import LoadingSpinner from "../components/LoadingSpinner";
import { useLanguage } from "../contexts/LanguageContext";

export default function LessonPage() {
  const { id } = useParams();
  const { lang } = useLanguage();
  const [lesson, setLesson] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchLesson(id), fetchQuizByLesson(id).catch(() => null)])
      .then(([lRes, qRes]) => {
        setLesson(lRes.data);
        setQuiz(qRes?.data || null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!lesson) return <p className="p-6">Lesson not found.</p>;

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <div className="space-y-1">
        <p className="text-xs uppercase text-primary font-semibold tracking-[0.2em]">
          {lang === "ar" ? "درس" : "Lesson"}
        </p>
        <h1 className="text-3xl font-black">{lesson.title}</h1>
        {lesson.importance && (
          <p className="text-muted-foreground whitespace-pre-line">{lesson.importance}</p>
        )}
      </div>

      <div className="space-y-4">
        {lesson.parts?.map((part) => (
          <Card key={part._id} className="p-5 space-y-2">
            <h3 className="text-lg font-bold">{part.title}</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{part.text}</p>
            {part.videos?.length ? (
              <div className="flex flex-wrap gap-3 pt-2">
                {part.videos.map((v) => (
                  <iframe
                    key={v}
                    src={v}
                    title={v}
                    className="w-full sm:w-72 aspect-video rounded-lg border"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                ))}
              </div>
            ) : null}
            {part.images?.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {part.images.map((img) => (
                  <img key={img} src={img} alt="" className="rounded-lg border object-cover" />
                ))}
              </div>
            ) : null}
          </Card>
        ))}
      </div>

      {quiz && (
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">{lang === "ar" ? "اختبار" : "Quiz"}</h3>
            <span className="text-xs text-muted-foreground">
              {quiz.questions?.length || 0} Qs
            </span>
          </div>
          <div className="space-y-4">
            {quiz.questions?.map((q) => (
              <div key={q._id} className="space-y-2">
                <p className="font-semibold">{q.question}</p>
                <ul className="space-y-1 text-sm">
                  {q.options.map((opt) => (
                    <li key={opt} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary inline-block" />
                      <span>{opt}</span>
                    </li>
                  ))}
                </ul>
                {q.explanation && (
                  <p className="text-xs text-muted-foreground whitespace-pre-line">
                    {q.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </main>
  );
}
