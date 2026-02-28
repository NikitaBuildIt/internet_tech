import ReservationForm from '../components/ReservationForm';
import './Reservation.css';

function Reservation() {
  return (
    <div className="reservation-page">
      <h1>Бронирование столика</h1>
      <ReservationForm />
    </div>
  );
}

export default Reservation;
