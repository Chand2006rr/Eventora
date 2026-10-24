const express = require("express");
const Event = require("../models/Event");
const protect = require("../middleware/auth");
const { sendScheduledMail } = require("../utils/mailer");

const router = express.Router();
router.use(protect);

const cleanEmails = (list) =>
  (Array.isArray(list) ? list : String(list || "").split(","))
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

// List my events (soonest first)
router.get("/", async (req, res) => {
  const events = await Event.find({ user: req.user._id }).sort({ startsAt: 1 });
  res.json(events);
});

// Create
router.post("/", async (req, res) => {
  try {
    const { title, description, location, startsAt, reminderMinutes, attendees } = req.body;
    if (!title || !startsAt)
      return res.status(400).json({ message: "Title, date and time are required" });
    if (new Date(startsAt) <= new Date())
      return res.status(400).json({ message: "Pick a date and time in the future" });

    const event = await Event.create({
      user: req.user._id,
      title,
      description,
      location,
      startsAt,
      reminderMinutes: Number(reminderMinutes) || 30,
      attendees: cleanEmails(attendees),
    });

    // confirmation email to organiser + attendees
    [req.user.email, ...event.attendees].forEach((to) => sendScheduledMail(to, event));
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update (re-arms the reminder)
router.put("/:id", async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, user: req.user._id });
    if (!event) return res.status(404).json({ message: "Event not found" });

    const { title, description, location, startsAt, reminderMinutes, attendees } = req.body;
    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (location !== undefined) event.location = location;
    if (startsAt !== undefined) event.startsAt = startsAt;
    if (reminderMinutes !== undefined) event.reminderMinutes = Number(reminderMinutes) || 30;
    if (attendees !== undefined) event.attendees = cleanEmails(attendees);
    event.reminderSent = false;

    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  const event = await Event.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json({ message: "Event deleted" });
});

module.exports = router;
