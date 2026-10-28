import { Router } from "express";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/", protect, async (req, res, next) => {
  try {
    const { hotelId, roomType, checkIn, checkOut, guests } = req.body;
    if (!hotelId || !roomType || !checkIn || !checkOut || !guests) {
      return res.status(400).json({ message: "Hotel, room, dates, and guest count are required." });
    }
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      return res.status(400).json({ message: "Check-out must be after check-in." });
    }
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return res.status(404).json({ message: "Hotel not found." });
    const room = hotel.rooms.find((r) => r.type === roomType);
    if (!room) return res.status(404).json({ message: "Room type not found." });
    if (Number(guests) < 1 || Number(guests) > room.capacity) return res.status(400).json({ message: `This room supports up to ${room.capacity} guests.` });
    if (room.availableRooms < 1) return res.status(409).json({ message: "No rooms of this type are currently available." });

    const booking = await Booking.create({
      user: req.user._id, hotel: hotel._id, roomType, checkIn: start, checkOut: end,
      guests: Number(guests), nights, totalPrice: nights * room.pricePerNight
    });
    room.availableRooms -= 1;
    await hotel.save();
    const populated = await booking.populate("hotel", "name city image address");
    res.status(201).json({ booking: populated });
  } catch (err) { next(err); }
});

router.get("/my", protect, async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("hotel", "name city image address").sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) { next(err); }
});

router.patch("/:id/cancel", protect, async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id }).populate("hotel");
    if (!booking) return res.status(404).json({ message: "Booking not found." });
    if (booking.status === "cancelled") return res.status(400).json({ message: "Booking is already cancelled." });
    if (new Date(booking.checkIn) <= new Date()) return res.status(400).json({ message: "A booking cannot be cancelled on or after check-in." });
    booking.status = "cancelled";
    await booking.save();
    const hotel = booking.hotel;
    const room = hotel.rooms.find((r) => r.type === booking.roomType);
    if (room) { room.availableRooms += 1; await hotel.save(); }
    res.json({ booking });
  } catch (err) { next(err); }
});

export default router;
