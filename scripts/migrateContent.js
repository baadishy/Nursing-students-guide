/**
 * One-off migration script:
 *  - reads content/extracted-content.json
 *  - creates Sections -> Categories -> Subjects -> Lessons -> Quizzes -> Questions
 *
 * ENV:
 *  API_URL      e.g. http://localhost:5000/api
 *  ADMIN_TOKEN  Bearer token for an admin user (Authorization header)
 *
 * Usage:
 *   node scripts/migrateContent.js
 */
const axios = require("axios");
const path = require("path");
const fs = require("fs");

const API_URL = process.env.API_URL || "http://localhost:5000/api";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

const client = axios.create({
  baseURL: API_URL,
  headers: ADMIN_TOKEN ? { Authorization: `Bearer ${ADMIN_TOKEN}` } : {},
});

const contentPath = path.join(__dirname, "..", "content", "extracted-content.json");
if (!fs.existsSync(contentPath)) {
  throw new Error("Run scripts/extractContent.js first to generate extracted-content.json");
}
const content = require(contentPath);

const log = (...args) => console.log("[migration]", ...args);

const ensureSection = async (name, description = "", order = 0) => {
  const { data } = await client.get("/sections");
  const existing = data.find((s) => s.name === name);
  if (existing) return existing;
  const created = await client.post("/sections", { name, description, order });
  return created.data;
};

const ensureCategory = async (sectionId, name, description = "", order = 0) => {
  const { data } = await client.get("/categories");
  const existing = data.find((c) => c.name === name && c.sectionId === sectionId);
  if (existing) return existing;
  const created = await client.post("/categories", { sectionId, name, description, order });
  return created.data;
};

const ensureSubject = async (categoryId, name, description = "") => {
  // subjects can belong to multiple categories, but here we bind one-to-one
  const { data } = await client.get("/subjects");
  const existing = data.find((s) => s.name === name && s.categoryIds?.includes(categoryId));
  if (existing) return existing;
  const created = await client.post("/subjects", {
    name,
    categoryIds: [categoryId],
    description,
  });
  return created.data;
};

const createLesson = async (subjectId, lesson) => {
  const importanceLines = [];
  if (lesson.importance) importanceLines.push(lesson.importance);
  if (lesson.objectives?.length) {
    importanceLines.push("Objectives:");
    importanceLines.push(...lesson.objectives.map((o) => `- ${o.text}`));
  }
  if (lesson.objectivesAr?.length) {
    importanceLines.push("الأهداف:");
    importanceLines.push(...lesson.objectivesAr.map((o) => `- ${o.text}`));
  }

  const parts = [];
  const addPart = (title, lines) => {
    if (lines && lines.length) parts.push({ title, text: lines.join("\n"), videos: [], images: [] });
  };

  addPart("Content", lesson.content || []);
  addPart("المحتوى", lesson.contentAr || []);

  if (lesson.keyConcepts?.length) {
    addPart(
      "Key Concepts",
      lesson.keyConcepts.map((k) => `${k.term}: ${k.definition}`),
    );
  }
  if (lesson.keyConceptsAr?.length) {
    addPart(
      "المفاهيم الرئيسية",
      lesson.keyConceptsAr.map((k) => `${k.term}: ${k.definition}`),
    );
  }
  if (lesson.clinicalConnection) {
    addPart("Clinical Connection", [
      lesson.clinicalConnection.title,
      lesson.clinicalConnection.description,
    ]);
  }
  if (lesson.clinicalConnectionAr) {
    addPart("التطبيق السريري", [
      lesson.clinicalConnectionAr.title,
      lesson.clinicalConnectionAr.description,
    ]);
  }
  if (lesson.quickReview?.length) addPart("Quick Review", lesson.quickReview);
  if (lesson.quickReviewAr?.length) addPart("مراجعة سريعة", lesson.quickReviewAr);
  if (lesson.summary?.length) addPart("Summary", lesson.summary);
  if (lesson.summaryAr?.length) addPart("الملخص", lesson.summaryAr);
  if (lesson.examPoints?.length) addPart("Exam Points", lesson.examPoints);
  if (lesson.examPointsAr?.length) addPart("نقاط الامتحان", lesson.examPointsAr);

  const payload = {
    title: lesson.title,
    subjectId,
    importance: importanceLines.join("\n"),
    parts: parts.length ? parts : [{ title: lesson.title, text: "", videos: [], images: [] }],
  };

  const created = await client.post("/lesson", payload);
  return created.data;
};

const createQuizForLesson = async (lessonId, lesson) => {
  if (!lesson.quiz?.length) return null;
  const quizRes = await client.post("/quiz", {
    lessonId,
    title: `${lesson.title} Quiz`,
    timeLimit: 0,
  });
  const quiz = quizRes.data;

  const pairedAr = {};
  lesson.quizAr?.forEach((q) => {
    pairedAr[q.id] = q;
  });

  for (const q of lesson.quiz) {
    const ar = pairedAr[q.id];
    const options = q.options.map((opt, idx) => {
      const arOpt = ar?.options?.[idx];
      return arOpt ? `${opt} / ${arOpt}` : opt;
    });
    const correctAnswer = options[q.correctAnswer];
    await client.post("/question", {
      quizId: quiz._id,
      question: ar ? `${q.question}\n${ar.question}` : q.question,
      options,
      correctAnswer,
      explanation: ar
        ? `${q.explanation || ""}\n${ar.explanation || ""}`.trim()
        : q.explanation || "",
    });
  }
  return quiz;
};

const run = async () => {
  log("Using API:", API_URL);
  const theoreticalSection = await ensureSection(
    "Theoretical Nursing",
    "Imported from legacy bundle (gv)",
    1,
  );
  const medSurgSection = await ensureSection(
    "Medical-Surgical Nursing",
    "Imported from legacy bundle (yv)",
    2,
  );

  const migrateBlock = async (section, chapters) => {
    for (let idx = 0; idx < chapters.length; idx++) {
      const chapter = chapters[idx];
      log("Migrating chapter", chapter.title);
      const category = await ensureCategory(
        section._id,
        chapter.title,
        chapter.description || "",
        idx,
      );
      const subject = await ensureSubject(category._id, chapter.title, chapter.description || "");

      for (const lesson of chapter.lessons) {
        log("  lesson", lesson.title);
        const createdLesson = await createLesson(subject._id, lesson);
        await createQuizForLesson(createdLesson._id, lesson);
      }
    }
  };

  await migrateBlock(theoreticalSection, content.theoretical);
  await migrateBlock(medSurgSection, content.medicalSurgical);

  log("Migration completed");
};

run().catch((err) => {
  console.error(err.response?.data || err.message);
  process.exit(1);
});
