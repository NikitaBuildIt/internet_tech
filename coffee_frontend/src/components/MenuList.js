import { useState, useEffect } from 'react';
import { getMenu, getMenuCategories } from '../services/api';
import './MenuList.css';

function MenuList() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getMenuCategories();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadMenu = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMenu(selectedCategory);
        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadMenu();
  }, [selectedCategory]);

  if (error) {
    return <div className="menu-error">Ошибка: {error}</div>;
  }

  return (
    <section className="menu-section">
      {categories.length > 0 && (
        <div className="menu-filters">
          <button
            className={`menu-filter-btn ${selectedCategory === null ? 'active' : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            Все
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`menu-filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="menu-loading">Загрузка меню...</div>
      ) : (
        <div className="menu-grid">
          {items.map((item) => (
            <article key={item.id} className="menu-card">
              <div className="menu-card-image">
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="menu-card-placeholder">☕</div>
                )}
              </div>
              <div className="menu-card-content">
                <h3 className="menu-card-title">{item.name}</h3>
                <p className="menu-card-category">{item.category_name}</p>
                {item.description && (
                  <p className="menu-card-desc">{item.description}</p>
                )}
                <p className="menu-card-price">{Number(item.price).toFixed(2)} ₽</p>
              </div>
            </article>
          ))}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <p className="menu-empty">Позиции меню пока не добавлены.</p>
      )}
    </section>
  );
}

export default MenuList;
