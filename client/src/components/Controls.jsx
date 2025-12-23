export default function Controls({
  showId,
  setShowId,
  seats,
  selectedSeat,
  setSelectedSeat,
  name,
  setName,
  onSeed,
  onRefresh,
  onHold,
  onConfirm,
  onCancel,
  status,
  bookingId
}) {
  return (
    <>
      <h1>Book My Show</h1>

      <button onClick={onSeed}>Seed Show + 30 Seats</button>
      <button onClick={onRefresh}>Refresh Seats</button>

      <div className="row">
        <label>Show ID:</label>
        <input
  value={showId}
  onChange={(e) => setShowId(e.target.value)}
  placeholder="Enter Show ID"
/>

<button onClick={onRefresh}>
  Load Show
</button>

        <label>Seat:</label>
        <select
          value={selectedSeat}
          onChange={(e) => setSelectedSeat(e.target.value)}
        >
          {seats.map(seat => (
            <option key={seat.seatId} value={seat.seatId}>
              {seat.seatId}
            </option>
          ))}
        </select>
      </div>

      <div className="row">
        <label>Name:</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <button onClick={onHold}>Checkout (Hold)</button>
        <button onClick={onConfirm}>Confirm Payment</button>
        <button onClick={onCancel}>Cancel Hold</button>
      </div>

      <p>
        <strong>Status:</strong>{" "}
        {status === "AVAILABLE" && "AVAILABLE"}
        {status === "HELD" && "HELD ✅"}
        {status === "BOOKED" && "CONFIRMED 🎉"}
      </p>

      {bookingId && (
        <p>
          <strong>Booking ID:</strong> {bookingId}
        </p>
      )}
    </>
  );
}
