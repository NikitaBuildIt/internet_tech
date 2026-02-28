import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <h1>Добро пожаловать в CoffeeTime</h1>
        <p className="hero-subtitle">Уютная кофейня с ароматным кофе и домашней атмосферой</p>
        <Link to="/reservation" className="hero-cta">Забронировать столик</Link>
      </section>

      <section className="home-features">
        <h2>Почему мы?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">☕</span>
            <h3>Свежий кофе</h3>
            <p>Обжариваем зёрна на собственной обжарке каждый день</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🍰</span>
            <h3>Домашняя выпечка</h3>
            <p>Пироги и десерты по рецептам нашей бабушки</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📅</span>
            <h3>Онлайн-бронирование</h3>
            <p>Забронируйте столик за несколько кликов</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
