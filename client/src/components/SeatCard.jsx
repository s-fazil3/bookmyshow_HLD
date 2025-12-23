export default function SeatCard({ seat }) {
  return (
    <div className={`seat ${seat.status.toLowerCase()}`}>
      <div>{seat.seatId}</div>
      <small>{seat.status}</small>
    </div>
  );
}
