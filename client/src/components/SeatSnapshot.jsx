export default function SeatSnapshot({ seat }) {
  return (
    <>
      <h3>Seat Snapshot</h3>
      <pre>{JSON.stringify(seat, null, 2)}</pre>
    </>
  );
}
