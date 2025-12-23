import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import Controls from "../components/Controls";
import SeatGrid from "../components/SeatGrid";
import SeatSnapshot from "../components/SeatSnapshot";

import {
  seedShow,
  getSeats,
  holdSeat,
  confirmSeat,
  cancelHold
} from "../api/bookingApi";

const socket = io("http://localhost:5000");

export default function BookingPage() {
  const [showId, setShowId] = useState("");
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("AVAILABLE");
  const [bookingId, setBookingId] = useState("");

  const fetchSeats = async (id = showId) => {
    if (!id) return;
    const res = await getSeats(id);
    setSeats(res.data);
    if (!selectedSeat && res.data.length > 0) {
      setSelectedSeat(res.data[0].seatId);
    }
  };

  const handleSeed = async () => {
    const res = await seedShow();
    setShowId(res.data.showId);
    setBookingId("");
    fetchSeats(res.data.showId);
  };

  const handleHold = async () => {
    await holdSeat({ showId, seatId: selectedSeat, name });
    setStatus("HELD");
  };

const handleConfirm = async () => {
  try {
    const res = await confirmSeat({ showId, seatId: selectedSeat });
    setStatus("BOOKED");
    setBookingId(res.data.bookingId);
  } catch (err) {
    if (err.response?.status === 410) {
      alert("Seat hold expired. Please hold the seat again.");
      setStatus("AVAILABLE");
    } else {
      alert("Something went wrong while confirming booking.");
    }
  }
};

  const handleCancel = async () => {
    await cancelHold({ showId, seatId: selectedSeat });
    setStatus("AVAILABLE");
  };

  useEffect(() => {
    if (!showId) return;

    socket.on("seat_update", (data) => {
      if (data.showId === showId) {
        fetchSeats(showId);
      }
    });

    socket.on("booking_confirmed", (data) => {
      if (data.showId === showId) {
        fetchSeats(showId);
        setBookingId(data.bookingId);
      }
    });

    return () => {
      socket.off("seat_update");
      socket.off("booking_confirmed");
    };
  }, [showId]);

  const currentSeat = seats.find(s => s.seatId === selectedSeat);

  return (
    <div className="container">
      <Controls
        showId={showId}
        setShowId={setShowId}  
        seats={seats}
        selectedSeat={selectedSeat}
        setSelectedSeat={setSelectedSeat}
        name={name}
        setName={setName}
        onSeed={handleSeed}
        onRefresh={() => fetchSeats(showId)}
        onHold={handleHold}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        status={status}
        bookingId={bookingId}
      />

      {currentSeat && <SeatSnapshot seat={currentSeat} />}
      <SeatGrid seats={seats} />
    </div>
  );
}
