const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    location: { type: String, default: "" },
    startsAt: { type: Date, required: true },          // date + time of the event
    reminderMinutes: { type: Number, default: 30 },     // email this many minutes before
    attendees: [{ type: String, lowercase: true, trim: true }], // extra emails to notify
    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
