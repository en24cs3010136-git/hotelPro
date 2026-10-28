import { Router } from "express";
import Hotel from "../models/Hotel.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { search, city } = req.query;
    const filter = {};
    if (search) filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { city: { $regex: search, $options: "i" } },
      { amenities: { $regex: search, $options: "i" } }
    ];
    if (city) filter.city = { $regex: city, $options: "i" };
    const hotels = await Hotel.find(filter).sort({ rating: -1 });
    res.json({ hotels });
  } catch (err) { next(err); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found." });
    res.json({ hotel });
  } catch (err) { next(err); }
});

router.post("/", protect, adminOnly, async (req, res, next) => {
  try { const hotel = await Hotel.create(req.body); res.status(201).json({ hotel }); }
  catch (err) { next(err); }
});
router.put("/:id", protect, adminOnly, async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!hotel) return res.status(404).json({ message: "Hotel not found." });
    res.json({ hotel });
  } catch (err) { next(err); }
});
router.delete("/:id", protect, adminOnly, async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found." });
    res.json({ message: "Hotel deleted." });
  } catch (err) { next(err); }
});

export default router;
