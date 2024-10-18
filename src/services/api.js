import axios from "axios";

console.log(import.meta.env.VITE_API_BASE_URL);
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const endpoints = {
  login: "/login",
  signup: "/signup",
  logout: "/logout",
  user: "/user",
  tasks: "/tasks",
  categories: "/categories",
};

const apiService = {
  // Auth
  login: (username, password) =>
    api.post(endpoints.login, { username, password }),
  signup: (username, email, password) =>
    api.post(endpoints.signup, { username, email, password }),
  logout: () => api.post(endpoints.logout),
  getUser: () => api.get(endpoints.user),

  // Tasks
  getTasks: (params) => api.get(endpoints.tasks, { params }),
  createTask: (taskData) => api.post(endpoints.tasks, taskData),
  updateTask: (taskId, taskData) =>
    api.put(`${endpoints.tasks}/${taskId}`, taskData),
  deleteTask: (taskId) => api.delete(`${endpoints.tasks}/${taskId}`),

  // Categories
  getCategories: () => api.get(endpoints.categories),
  createCategory: (categoryData) =>
    api.post(endpoints.categories, categoryData),
  deleteCategory: (categoryId) =>
    api.delete(`${endpoints.categories}/${categoryId}`),
};

export default apiService;
