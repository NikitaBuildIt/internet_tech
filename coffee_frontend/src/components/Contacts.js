import './Contacts.css';

function Contacts() {
  return (
    <section className="contacts-section">
      <h2>Контакты</h2>
      <div className="contacts-grid">
        <div className="contacts-block">
          <h3>Адрес</h3>
          <p>г. Новосибирск, ул. Кофейная, д. 1</p>
          <p>Метро: «Студенческая»</p>
        </div>
        <div className="contacts-block">
          <h3>Режим работы</h3>
          <p>Пн–Пт: 8:00 – 22:00</p>
          <p>Сб–Вс: 9:00 – 23:00</p>
        </div>
        <div className="contacts-block">
          <h3>Телефон</h3>
          <p>+7 (777) 777-77-77</p>
        </div>
        <div className="contacts-block">
          <h3>Email</h3>
          <p>info@coffeetime.ru</p>
        </div>
      </div>
    </section>
  );
}

export default Contacts;
