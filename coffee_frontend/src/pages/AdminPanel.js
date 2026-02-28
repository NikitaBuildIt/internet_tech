import { useState, useEffect } from 'react';
import {
  getReservations,
  updateReservationStatus,
  getMenuItems,
  getMenuCategories,
  getTables,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  createTable,
  updateTable,
  deleteTable,
} from '../services/api';
import './AdminPanel.css';

const STATUS_LABELS = {
  pending: 'Ожидает',
  confirmed: 'Подтверждено',
  cancelled: 'Отменено',
};

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('reservations');
  const [reservations, setReservations] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  });
  const [newTable, setNewTable] = useState({
    seats: '',
    location: 'hall',
  });

  const loadReservations = async () => {
    setLoading(true);
    try {
      const data = await getReservations();
      setReservations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMenu = async () => {
    setLoading(true);
    try {
      const [items, cats] = await Promise.all([getMenuItems(), getMenuCategories()]);
      setMenuItems(items);
      setCategories(cats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTables = async () => {
    setLoading(true);
    try {
      const data = await getTables();
      setTables(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setError(null);
    if (activeTab === 'reservations') loadReservations();
    else if (activeTab === 'menu') loadMenu();
    else if (activeTab === 'tables') loadTables();
  }, [activeTab]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateReservationStatus(id, newStatus);
      loadReservations();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      await updateMenuItem(item.id, { is_available: !item.is_available });
      loadMenu();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNewMenuItemChange = (e) => {
    const { name, value } = e.target;
    setNewMenuItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateMenuItem = async (e) => {
    e.preventDefault();
    setError(null);
    if (!newMenuItem.name.trim() || !newMenuItem.price || !newMenuItem.category) {
      setError('Заполните название, цену и категорию позиции меню.');
      return;
    }
    try {
      await createMenuItem({
        name: newMenuItem.name.trim(),
        description: newMenuItem.description.trim(),
        price: parseFloat(newMenuItem.price.replace(',', '.')) || 0,
        category: parseInt(newMenuItem.category, 10),
        is_available: true,
      });
      setNewMenuItem({
        name: '',
        description: '',
        price: '',
        category: '',
      });
      loadMenu();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNewTableChange = (e) => {
    const { name, value } = e.target;
    setNewTable((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTable = async (e) => {
    e.preventDefault();
    setError(null);
    if (!newTable.seats) {
      setError('Укажите количество мест для столика.');
      return;
    }
    try {
      await createTable({
        seats: parseInt(newTable.seats, 10) || 1,
        location: newTable.location,
        is_active: true,
      });
      setNewTable({
        seats: '',
        location: 'hall',
      });
      loadTables();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-panel">
      <h1>Панель управления</h1>

      <div className="admin-tabs">
        <button
          className={activeTab === 'reservations' ? 'active' : ''}
          onClick={() => setActiveTab('reservations')}
        >
          Бронирования
        </button>
        <button
          className={activeTab === 'menu' ? 'active' : ''}
          onClick={() => setActiveTab('menu')}
        >
          Меню
        </button>
        <button
          className={activeTab === 'tables' ? 'active' : ''}
          onClick={() => setActiveTab('tables')}
        >
          Столики
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}
      {loading && <div className="admin-loading">Загрузка...</div>}

      {activeTab === 'reservations' && !loading && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Клиент</th>
                <th>Телефон</th>
                <th>Столик</th>
                <th>Дата</th>
                <th>Время</th>
                <th>Гости</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id}>
                  <td>{r.client_name}</td>
                  <td>{r.client_phone}</td>
                  <td>{r.table_info}</td>
                  <td>{r.date}</td>
                  <td>{r.time}</td>
                  <td>{r.guests_count}</td>
                  <td>{STATUS_LABELS[r.status]}</td>
                  <td>
                    {r.status !== 'confirmed' && (
                      <button
                        className="btn-sm btn-confirm"
                        onClick={() => handleStatusChange(r.id, 'confirmed')}
                      >
                        Подтвердить
                      </button>
                    )}
                    {r.status !== 'cancelled' && (
                      <button
                        className="btn-sm btn-cancel"
                        onClick={() => handleStatusChange(r.id, 'cancelled')}
                      >
                        Отменить
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reservations.length === 0 && <p className="admin-empty">Бронирований нет</p>}
        </div>
      )}

      {activeTab === 'menu' && !loading && (
        <>
          <form className="admin-form" onSubmit={handleCreateMenuItem}>
            <h2 className="admin-form-title">Добавить позицию меню</h2>
            <div className="admin-form-row">
              <label>
                Название
                <input
                  type="text"
                  name="name"
                  value={newMenuItem.name}
                  onChange={handleNewMenuItemChange}
                  required
                />
              </label>
              <label>
                Цена (₽)
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  value={newMenuItem.price}
                  onChange={handleNewMenuItemChange}
                  required
                />
              </label>
              <label>
                Категория
                <select
                  name="category"
                  value={newMenuItem.category}
                  onChange={handleNewMenuItemChange}
                  required
                >
                  <option value="">Выберите...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="admin-form-full">
              Описание (опционально)
              <textarea
                name="description"
                rows="2"
                value={newMenuItem.description}
                onChange={handleNewMenuItemChange}
              />
            </label>
            <button type="submit" className="btn-submit-admin">
              Добавить в меню
            </button>
          </form>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Категория</th>
                  <th>Цена</th>
                  <th>Доступно</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => (
                  <tr key={item.id} className={!item.is_available ? 'menu-item-stopped' : ''}>
                    <td>{item.name}</td>
                    <td>{item.category_name}</td>
                    <td>{Number(item.price).toFixed(2)} ₽</td>
                    <td>{item.is_available ? 'Да' : 'В стопе'}</td>
                    <td>
                      <button
                        type="button"
                        className={`btn-sm ${item.is_available ? 'btn-stop' : 'btn-restore'}`}
                        onClick={() => handleToggleAvailability(item)}
                      >
                        {item.is_available ? 'В стоп' : 'Снять'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {menuItems.length === 0 && <p className="admin-empty">Позиций меню нет</p>}
          </div>
        </>
      )}

      {activeTab === 'tables' && !loading && (
        <>
          <form className="admin-form" onSubmit={handleCreateTable}>
            <h2 className="admin-form-title">Добавить столик</h2>
            <div className="admin-form-row">
              <label>
                Количество мест
                <input
                  type="number"
                  name="seats"
                  min="1"
                  max="20"
                  value={newTable.seats}
                  onChange={handleNewTableChange}
                  required
                />
              </label>
              <label>
                Расположение
                <select
                  name="location"
                  value={newTable.location}
                  onChange={handleNewTableChange}
                >
                  <option value="hall">Зал</option>
                  <option value="terrace">Терраса</option>
                </select>
              </label>
            </div>
            <button type="submit" className="btn-submit-admin">
              Добавить столик
            </button>
          </form>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Мест</th>
                  <th>Расположение</th>
                  <th>Активен</th>
                </tr>
              </thead>
              <tbody>
                {tables.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.seats}</td>
                    <td>{t.location_display}</td>
                    <td>{t.is_active ? 'Да' : 'Нет'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {tables.length === 0 && <p className="admin-empty">Столиков нет</p>}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminPanel;
