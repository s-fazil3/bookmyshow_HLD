const router = require("express").Router();
const redis = require("../redis");
const pool = require("../db");
const { v4: uuid } = require("uuid");
const socket = require("../socket");

/* HOLD SEAT */
router.post("/hold", async (req, res) => {
  const { showId, seatId, name } = req.body;
  const holdKey = `hold:${showId}:${seatId}`;

  if (await redis.exists(holdKey))
    return res.status(409).json({ msg: "Seat already held" });

  await redis.set(
    holdKey,
    JSON.stringify({ name }),
    "EX",
    30
  );

  socket.getIO().emit("seat_update", { showId });
  res.json({ status: "HELD" });
});

/* CONFIRM SEAT */
router.post("/confirm", async (req, res) => {
  const { showId, seatId } = req.body;
  const holdKey = `hold:${showId}:${seatId}`;

  if (!(await redis.exists(holdKey)))
    return res.status(410).json({ msg: "Hold expired" });

  const bookingId = uuid();

  try {
    await pool.query(
      "INSERT INTO bookings VALUES (?,?,?,?,NOW())",
      [bookingId, showId, seatId, "USER"]
    );

    await redis.del(holdKey);

    socket.getIO().emit("booking_confirmed", {
      showId,
      bookingId
    });

    res.json({ bookingId });
  } catch (err) {
    res.status(409).json({ msg: "Seat already booked" });
  }
});

/* CANCEL HOLD */
router.post("/cancel", async (req, res) => {
  const { showId, seatId } = req.body;
  await redis.del(`hold:${showId}:${seatId}`);
  socket.getIO().emit("seat_update", { showId });
  res.json({ status: "AVAILABLE" });
});

module.exports = router;
