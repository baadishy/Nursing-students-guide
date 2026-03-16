import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

export const setAuthToken = (token) => {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
};

export const fetchSections = () => api.get("/sections");
export const fetchCategoriesBySection = (sectionId) =>
  api.get(sectionId ? `/categories/${sectionId}` : "/categories");
export const fetchSubjectsByCategory = (categoryId) =>
  api.get(categoryId ? `/subjects/${categoryId}` : "/subjects");
export const fetchLessonsBySubject = (subjectId) => api.get(`/lessons/${subjectId}`);
export const fetchLesson = (lessonId) => api.get(`/lesson/${lessonId}`);
export const fetchQuizByLesson = (lessonId) => api.get(`/quiz/${lessonId}`);

export const login = (payload) => api.post("/auth/login", payload);
export const signup = (payload) => api.post("/auth/signup", payload);

export const fetchUsers = () => api.get("/users");
export const approveUser = (id, status = true) =>
  api.patch(`/users/approve/${id}`, { isApproved: status });

export const createSection = (payload) => api.post("/sections", payload);
export const createCategory = (payload) => api.post("/categories", payload);
export const createSubject = (payload) => api.post("/subjects", payload);
export const createLesson = (payload) => api.post("/lesson", payload);
export const updateLesson = (lessonId, payload) => api.patch(`/lesson/${lessonId}`, payload);
export const createLessonPart = (lessonId, payload) =>
  api.post(`/lesson/${lessonId}/part`, payload);
export const createQuiz = (payload) => api.post("/quiz", payload);
export const createQuestion = (payload) => api.post("/question", payload);
