import { useEffect, useState } from "react";
import Card from "../../components/Card";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  fetchSections,
  fetchCategoriesBySection,
  fetchSubjectsByCategory,
  fetchLessonsBySubject,
  fetchQuizByLesson,
  createQuiz,
  createQuestion,
} from "../../services/api";

export default function AdminQuizzes() {
  const [sections, setSections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selection, setSelection] = useState({
    sectionId: "",
    categoryId: "",
    subjectId: "",
    lessonId: "",
  });
  const [quiz, setQuiz] = useState(null);
  const [question, setQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    explanation: "",
  });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchSections()
      .then((res) => setSections(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selection.sectionId) return;
    fetchCategoriesBySection(selection.sectionId).then((res) => setCategories(res.data));
    setSelection((s) => ({ ...s, categoryId: "", subjectId: "", lessonId: "" }));
    setSubjects([]);
    setLessons([]);
    setQuiz(null);
  }, [selection.sectionId]);

  useEffect(() => {
    if (!selection.categoryId) return;
    fetchSubjectsByCategory(selection.categoryId).then((res) => setSubjects(res.data));
    setSelection((s) => ({ ...s, subjectId: "", lessonId: "" }));
    setLessons([]);
    setQuiz(null);
  }, [selection.categoryId]);

  useEffect(() => {
    if (!selection.subjectId) return;
    fetchLessonsBySubject(selection.subjectId).then((res) => setLessons(res.data));
    setSelection((s) => ({ ...s, lessonId: "" }));
    setQuiz(null);
  }, [selection.subjectId]);

  const loadQuiz = () =>
    fetchQuizByLesson(selection.lessonId)
      .then((res) => setQuiz(res.data))
      .catch(() => setQuiz(null));

  useEffect(() => {
    if (!selection.lessonId) return;
    loadQuiz();
  }, [selection.lessonId]);

  const ensureQuiz = async () => {
    if (quiz) return quiz;
    const res = await createQuiz({
      lessonId: selection.lessonId,
      title: "Quiz",
      timeLimit: 0,
    });
    setQuiz(res.data);
    return res.data;
  };

  const submitQuestion = async (e) => {
    e.preventDefault();
    const qz = await ensureQuiz();
    await createQuestion({
      quizId: qz._id,
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
    });
    setMsg("Question added");
    setQuestion({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      explanation: "",
    });
    loadQuiz();
  };

  const setOption = (idx, val) => {
    const next = [...question.options];
    next[idx] = val;
    setQuestion({ ...question, options: next });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Quizzes & Questions</h1>
      <Card className="p-5 space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <select
            className="border rounded-lg px-3 py-2"
            value={selection.sectionId}
            onChange={(e) => setSelection({ sectionId: e.target.value, categoryId: "", subjectId: "", lessonId: "" })}
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
            value={selection.categoryId}
            onChange={(e) => setSelection((p) => ({ ...p, categoryId: e.target.value }))}
            disabled={!selection.sectionId}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            className="border rounded-lg px-3 py-2"
            value={selection.subjectId}
            onChange={(e) => setSelection((p) => ({ ...p, subjectId: e.target.value }))}
            disabled={!selection.categoryId}
          >
            <option value="">Select subject</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
          <select
            className="border rounded-lg px-3 py-2"
            value={selection.lessonId}
            onChange={(e) => setSelection((p) => ({ ...p, lessonId: e.target.value }))}
            disabled={!selection.subjectId}
          >
            <option value="">Select lesson</option>
            {lessons.map((l) => (
              <option key={l._id} value={l._id}>
                {l.title}
              </option>
            ))}
          </select>
        </div>

        {selection.lessonId && (
          <form onSubmit={submitQuestion} className="space-y-3 pt-4">
            <input
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Question"
              value={question.question}
              onChange={(e) => setQuestion({ ...question, question: e.target.value })}
              required
            />
            <div className="grid sm:grid-cols-2 gap-2">
              {question.options.map((opt, idx) => (
                <input
                  key={idx}
                  className="border rounded-lg px-3 py-2"
                  placeholder={`Option ${idx + 1}`}
                  value={opt}
                  onChange={(e) => setOption(idx, e.target.value)}
                  required
                />
              ))}
            </div>
            <input
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Correct answer (must match one option)"
              value={question.correctAnswer}
              onChange={(e) => setQuestion({ ...question, correctAnswer: e.target.value })}
              required
            />
            <textarea
              className="w-full border rounded-lg px-3 py-2 min-h-[80px]"
              placeholder="Explanation (optional)"
              value={question.explanation}
              onChange={(e) => setQuestion({ ...question, explanation: e.target.value })}
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold"
            >
              Add Question
            </button>
            {msg && <p className="text-green-600 text-sm">{msg}</p>}
          </form>
        )}
      </Card>

      {quiz?.questions?.length ? (
        <Card className="p-5 space-y-3">
          <h2 className="text-lg font-semibold">Existing questions</h2>
          <ul className="space-y-3">
            {quiz.questions.map((q) => (
              <li key={q._id} className="border rounded-lg p-3 space-y-1">
                <div className="font-semibold">{q.question}</div>
                <ul className="list-disc pl-5 text-sm">
                  {q.options.map((opt) => (
                    <li key={opt} className={opt === q.correctAnswer ? "font-semibold text-primary" : ""}>
                      {opt}
                    </li>
                  ))}
                </ul>
                {q.explanation && (
                  <p className="text-xs text-muted-foreground whitespace-pre-line">{q.explanation}</p>
                )}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </main>
  );
}
