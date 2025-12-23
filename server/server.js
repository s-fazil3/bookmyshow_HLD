const express = require("express");
const http = require("http");
const cors = require("cors");

const redis = require("./redis");
const pool = require("./db");
const socket = require("./socket");

const showRoutes = require("./routes/show.routes");
const seatRoutes = require("./routes/seat.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/show", showRoutes);
app.use("/api/seat", seatRoutes);

const server = http.createServer(app);
const io = socket.init(server);

/* 🔥 Redis expiry listener */
redis.config("SET", "notify-keyspace-events", "Ex");
const sub = redis.duplicate();
sub.psubscribe("__keyevent@0__:expired");

sub.on("pmessage", (_, __, key) => {
  if (key.startsWith("hold:")) {
    const [, showId] = key.split(":");
    io.emit("seat_update", { showId });
  }
});

server.listen(5000, () =>
  console.log("Server running on http://localhost:5000")
);
