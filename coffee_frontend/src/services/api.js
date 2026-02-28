/**
 * API сервис для взаимодействия с Django REST backend.
 * Базовый URL настроен для development (proxy в package.json).
 */

const API_BASE = '/api';

/**
 * Загрузка меню с опциональной фильтрацией по категории.
 */
export const getMenu = async (categoryId = null) => {
  const url = categoryId
    ? `${API_BASE}/menu/?category=${categoryId}`
    : `${API_BASE}/menu/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Ошибка загрузки меню');
  const data = await res.json();
  // DRF возвращает { count, next, previous, results }; нужен массив
  return Array.isArray(data) ? data : (data.results || []);
};

/**
 * Загрузка категорий меню.
 */
export const getMenuCategories = async () => {
  const res = await fetch(`${API_BASE}/menu_categories/`);
  if (!res.ok) throw new Error('Ошибка загрузки категорий');
  const data = await res.json();
  return Array.isArray(data) ? data : (data.results || []);
};

/**
 * Загрузка столиков.
 */
export const getTables = async () => {
  const res = await fetch(`${API_BASE}/tables/`);
  if (!res.ok) throw new Error('Ошибка загрузки столиков');
  const data = await res.json();
  return Array.isArray(data) ? data : (data.results || []);
};

/**
 * Создание бронирования.
 * @param {Object} data - { name, phone, email, date, time, guests_count, location? }
 */
export const createReservation = async (data) => {
  const res = await fetch(`${API_BASE}/reservations/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    const message = result.detail || result.non_field_errors?.[0] || JSON.stringify(result);
    throw new Error(typeof message === 'string' ? message : 'Ошибка бронирования');
  }

  return result;
};

/**
 * Загрузка списка бронирований.
 */
export const getReservations = async () => {
  const res = await fetch(`${API_BASE}/reservations/`);
  if (!res.ok) throw new Error('Ошибка загрузки бронирований');
  const data = await res.json();
  return Array.isArray(data) ? data : (data.results || []);
};

/**
 * Обновление статуса бронирования (для админки).
 */
export const updateReservationStatus = async (id, status) => {
  const res = await fetch(`${API_BASE}/reservations/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const result = await res.json();
    throw new Error(result.detail || 'Ошибка обновления');
  }
  return res.json();
};

/**
 * CRUD для меню (админка).
 */
export const getMenuItems = async (categoryId = null) => {
  const url = categoryId
    ? `${API_BASE}/menu_items/?category=${categoryId}`
    : `${API_BASE}/menu_items/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Ошибка загрузки меню');
  const data = await res.json();
  return Array.isArray(data) ? data : (data.results || []);
};

export const createMenuItem = async (data) => {
  const res = await fetch(`${API_BASE}/menu_items/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(JSON.stringify(err));
  }
  return res.json();
};

export const updateMenuItem = async (id, data) => {
  const res = await fetch(`${API_BASE}/menu_items/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Ошибка обновления');
  return res.json();
};

export const deleteMenuItem = async (id) => {
  const res = await fetch(`${API_BASE}/menu_items/${id}/`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Ошибка удаления');
};

/**
 * CRUD для столиков (админка).
 */
export const createTable = async (data) => {
  const res = await fetch(`${API_BASE}/tables/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Ошибка создания');
  return res.json();
};

export const updateTable = async (id, data) => {
  const res = await fetch(`${API_BASE}/tables/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Ошибка обновления');
  return res.json();
};

export const deleteTable = async (id) => {
  const res = await fetch(`${API_BASE}/tables/${id}/`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Ошибка удаления');
};
