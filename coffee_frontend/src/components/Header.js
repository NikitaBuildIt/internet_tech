import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">CoffeeTime</Link>
        <nav className="header-nav">
          <Link to="/" className="header-link">Главная</Link>
          <Link to="/menu" className="header-link">Меню</Link>
          <Link to="/reservation" className="header-link">Бронирование</Link>
          <Link to="/contacts" className="header-link">Контакты</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
