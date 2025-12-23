const router = require("express").Router();
const { v4: uuid } = require("uuid");
const redis = require("../redis");
const pool = require("../db");

/* Seed show + 30 seats */
router.post("/seed", async (_, res) => {
  const showId = uuid();
  const seats = Array.from({ length: 30 }, (_, i) => `A${i + 1}`)
    .sort(() => Math.random() - 0.5);

  for (const seat of seats) {
    await redis.set(`seat:${showId}:${seat}`, "AVAILABLE");
  }

  res.json({ showId });
});

/* Get merged seat state */
router.get("/:showId/seats", async (req, res) => {
  const { showId } = req.params;

  const [booked] = await pool.query(
    "SELECT seat_number FROM bookings WHERE show_id=?",
    [showId]
  );
  const bookedSeats = booked.map(b => b.seat_number);

  const keys = await redis.keys(`seat:${showId}:*`);
  const seats = [];

  for (const key of keys) {
    const seatId = key.split(":")[2];
    let status = "AVAILABLE";

    if (bookedSeats.includes(seatId)) status = "BOOKED";
    else {
      const holdKey = `hold:${showId}:${seatId}`;
      if (await redis.exists(holdKey)) status = "HELD";
    }

    seats.push({ seatId, status });
  }

  res.json(seats);
});

module.exports = router;
