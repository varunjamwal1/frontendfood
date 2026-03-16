import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 30000,
});

// Helper: Convert Object to FormData
const createFormData = (data) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    // FIXED: Added 'undefined' to the comparison
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });

  return formData;
};

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// AUTH APIs (Login, Register, & Staff Management)
export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
getCafeStatus: () => api.get('/cafe-status'),
  updateCafeStatus: (data) => api.put('/cafe-status', data),
  // --- Staff Management (Owner Only) ---
  getStaff: () => api.get("/auth"), // Get all staff
  updateStaff: (id, data) => api.put(`/auth/${id}`, data), // Update staff
  deleteStaff: (id) => api.delete(`/auth/${id}`), // Delete staff
};

// CATEGORIES APIs
export const categoriesAPI = {
  getAll: () => api.get("/categories"),
  create: (data) => api.post("/categories", createFormData(data), {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  update: (id, data) => api.put(`/categories/${id}`, createFormData(data), {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  delete: (id) => api.delete(`/categories/${id}`),
};

// ITEMS APIs
export const itemsAPI = {
  getAll: (params) => api.get("/items", { params }),
  create: (data) => api.post("/items", createFormData(data), {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  update: (id, data) => api.put(`/items/${id}`, createFormData(data), {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  delete: (id) => api.delete(`/items/${id}`),
  togglePopular: (id) => api.put(`/items/popular/${id}`),
};

// TABLES APIs
export const tablesAPI = {
  getAll: () => api.get("/tables"),
  create: (data) => api.post("/tables", data),
  update: (id, data) => api.put(`/tables/${id}`, data),
  delete: (id) => api.delete(`/tables/${id}`),
};

// ORDERS APIs
export const ordersAPI = {

  // Get all orders
  getAll: (params) => api.get("/orders", { params }),

  // Get single order
  getById: (id) => api.get(`/orders/${id}`),

  // Create order
  create: (data) => api.post("/orders", data),
completeOrder: (id) => api.put(`/orders/complete/${id}`),
  // Update order status
  updateStatus: (id, status) =>
    api.put(`/orders/status/${id}`, { status }),

  // Staff approves order
  approveOrder: (id) =>
    api.put(`/orders/approve/${id}`),

  // Cancel order
  cancelOrder: (id, reason) =>
    api.put(`/orders/cancel/${id}`, { reason }),

  // Stats
  getStats: () =>
    api.get("/orders/stats"),

  // Customer orders
  getCustomerOrders: (params) =>
    api.get("/orders/customer", { params }),

  // Staff orders
  getStaffOrders: () =>
    api.get("/orders", {
      params: { source: "staff" }
    }),

  // Counter orders
  getCounterOrders: () =>
    api.get("/orders", {
      params: { source: "counter" }
    }),

  // Pending approvals
  getPendingApprovals: () =>
    api.get("/orders", {
      params: { status: "pending", source: "customer" }
    })

};
// TAXES APIs
export const taxesAPI = {
  getAll: () => api.get("/taxes"),
  create: (data) => api.post("/taxes", data),
  update: (id, data) => api.put(`/taxes/${id}`, data),
  delete: (id) => api.delete(`/taxes/${id}`),
};

// PAYMENT APIs
export const paymentAPI = {
  createOrder: (data) => api.post("/payment/create-order", data),
  verifyPayment: (data) => api.post("/payment/verify", data),
};

export const menuAPI = {
  getItems: () => api.get("/items"),
  getCategories: () => api.get("/categories"),
  getTables: () => api.get("/tables"),
};

export const orderAPI = {
  create: (data) => api.post("/orders", data),
};

export default api;