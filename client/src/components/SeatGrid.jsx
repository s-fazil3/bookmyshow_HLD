import SeatCard from "./SeatCard";

export default function SeatGrid({ seats }) {
  return (
    <>
      <h3>All Seats</h3>
      <div className="grid">
        {seats.map(seat => (
          <SeatCard key={seat.seatId} seat={seat} />
        ))}
      </div>
    </>
  );
}
