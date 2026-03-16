import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchLessonsBySubject } from "../services/api";
import Card from "../components/Card";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router-dom";

export default function SubjectPage() {
  const { id } = useParams();
  const [lessons, setLessons] = useState(null);

  useEffect(() => {
    fetchLessonsBySubject(id)
      .then((res) => setLessons(res.data))
      .catch(() => setLessons([]));
  }, [id]);

  if (lessons === null) return <LoadingSpinner />;

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-4">
      <h1 className="text-2xl font-bold">Lessons</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {lessons.map((lesson) => (
          <Card key={lesson._id} className="p-4 space-y-2">
            <h3 className="text-lg font-bold">{lesson.title}</h3>
            {lesson.importance && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {lesson.importance}
              </p>
            )}
            <Link
              to={`/lesson/${lesson._id}`}
              className="text-sm text-primary font-semibold inline-flex items-center gap-1"
            >
              Open →
            </Link>
          </Card>
        ))}
      </div>
    </main>
  );
}
