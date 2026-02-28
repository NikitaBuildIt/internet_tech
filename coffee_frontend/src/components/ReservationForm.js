import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createReservation } from '../services/api';
import './ReservationForm.css';

function ReservationForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    guests_count: 1,
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const today = new Date().toISOString().slice(0, 10);

  const isValidTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return true;
    const slot = new Date(dateStr + 'T' + timeStr);
    const now = new Date();
    if (slot <= now) return false;
    const weekday = slot.getDay();
    const minutes = slot.getHours() * 60 + slot.getMinutes();
    const isWeekend = weekday === 0 || weekday === 6;
    const [start, end] = isWeekend ? [9 * 60, 23 * 60] : [8 * 60, 22 * 60];
    return minutes >= start && minutes <= end;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    if (!isValidTime(form.date, form.time)) {
      setError(
        'Проверьте дату и время. Нельзя бронировать на прошедшее время. Режим: Пн–Пт 8:00–22:00, Сб–Вс 9:00–23:00.'
      );
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        date: form.date,
        time: form.time,
        guests_count: parseInt(form.guests_count, 10) || 1,
      };
      if (form.location) payload.location = form.location;

      await createReservation(payload);
      setSuccess(true);
      setForm({
        name: '',
        phone: '',
        email: '',
        date: '',
        time: '',
        guests_count: 1,
        location: '',
      });
      onSuccess && onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="reservation-success">
        <h3>Бронирование создано!</h3>
        <p>Мы свяжемся с вами для подтверждения бронирования.</p>
        <Link to="/" className="btn-home">На главную</Link>
      </div>
    );
  }

  return (
    <form className="reservation-form" onSubmit={handleSubmit}>
      <h3>Забронировать столик</h3>

      {error && <div className="reservation-error">{error}</div>}

      <div className="form-row">
        <label>
          Имя <span>*</span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Телефон <span>*</span>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <label>
        Email <span>*</span>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </label>

      <div className="form-row">
        <label>
          Дата <span>*</span>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            min={today}
            required
          />
        </label>
        <label>
          Время <span>*</span>
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Количество гостей
          <input
            type="number"
            name="guests_count"
            min="1"
            max="20"
            value={form.guests_count}
            onChange={handleChange}
          />
        </label>
        <label>
          Расположение (по желанию)
          <select name="location" value={form.location} onChange={handleChange}>
            <option value="">Любое</option>
            <option value="hall">Зал</option>
            <option value="terrace">Терраса</option>
          </select>
        </label>
      </div>

      <button type="submit" className="btn-submit" disabled={loading}>
        {loading ? 'Отправка...' : 'Забронировать'}
      </button>
    </form>
  );
}

export default ReservationForm;
