export const BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

async function request(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${BASE}${path}`, opts);
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

export const CategoryAPI = {
  list: () => request(`/api/category/all`),
  create: (formData: FormData | object) => {
    if (formData instanceof FormData) return request(`/api/category/create`, { method: 'POST', body: formData });
    return request(`/api/category/create`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
  },
  update: (id: string, formData: FormData | object) => {
    if (formData instanceof FormData) return request(`/api/category/update/${id}`, { method: 'PUT', body: formData });
    return request(`/api/category/update/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
  },
  delete: (id: string) => request(`/api/category/delete/${id}`, { method: 'DELETE' }),
};

export const ProductAPI = {
  list: (category?: string) => request(`/api/product/all${category ? `?category=${category}` : ''}`),
  create: (formData: FormData | object) => {
    if (formData instanceof FormData) return request(`/api/product/create`, { method: 'POST', body: formData });
    return request(`/api/product/create`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
  },
  update: (id: string, formData: FormData | object) => {
    if (formData instanceof FormData) return request(`/api/product/update/${id}`, { method: 'PUT', body: formData });
    return request(`/api/product/update/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
  },
  delete: (id: string) => request(`/api/product/delete/${id}`, { method: 'DELETE' }),
};

export const OrderAPI = {
  list: (user?: string) => request(`/api/order/all${user ? `?user=${user}` : ''}`),
  create: (data: object) => request(`/api/order/create`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
  update: (id: string, data: object) => request(`/api/order/update/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
  delete: (id: string) => request(`/api/order/delete/${id}`, { method: 'DELETE' }),
};

export default request;
