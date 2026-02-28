import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">CoffeeTime</h3>
          <p className="footer-text">Ваш уютный уголок для чашечки кофе</p>
        </div>
        <div className="footer-section">
          <h4 className="footer-subtitle">Навигация</h4>
          <nav className="footer-nav">
            <Link to="/">Главная</Link>
            <Link to="/menu">Меню</Link>
            <Link to="/reservation">Бронирование</Link>
            <Link to="/contacts">Контакты</Link>
          </nav>
        </div>
        <div className="footer-copy">
          © {currentYear} CoffeeTime. Лабораторная работа по Интернет-технологиям.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
