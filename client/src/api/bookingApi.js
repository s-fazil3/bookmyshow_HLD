import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const seedShow = () => API.post("/show/seed");
export const getSeats = (showId) => API.get(`/show/${showId}/seats`);
export const holdSeat = (data) => API.post("/seat/hold", data);
export const confirmSeat = (data) => API.post("/seat/confirm", data);
export const cancelHold = (data) => API.post("/seat/cancel", data);
