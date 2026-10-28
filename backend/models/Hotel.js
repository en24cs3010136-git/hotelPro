import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  type: { type: String, required: true },
  pricePerNight: { type: Number, required: true, min: 0 },
  capacity: { type: Number, required: true, min: 1 },
  availableRooms: { type: Number, default: 1, min: 0 },
  description: { type: String, default: "" }
});

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  address: { type: String, required: true },
  description: { type: String, default: "" },
  image: { type: String, default: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200" },
  rating: { type: Number, default: 4.2, min: 0, max: 5 },
  amenities: [{ type: String }],
  rooms: [roomSchema]
}, { timestamps: true });

export default mongoose.model("Hotel", hotelSchema);
