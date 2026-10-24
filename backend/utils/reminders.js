const Event = require("../models/Event");
const { sendReminderMail } = require("./mailer");

// Runs every minute; emails events whose reminder time has arrived.
async function checkReminders() {
  const now = new Date();
  const candidates = await Event.find({
    reminderSent: false,
    startsAt: { $gt: now },
  }).populate("user", "email");

  for (const ev of candidates) {
    const remindAt = new Date(ev.startsAt.getTime() - ev.reminderMinutes * 60000);
    if (remindAt <= now) {
      const recipients = [ev.user.email, ...ev.attendees];
      await Promise.all(recipients.map((to) => sendReminderMail(to, ev)));
      ev.reminderSent = true;
      await ev.save();
    }
  }
}

module.exports = function startReminders() {
  setInterval(() => checkReminders().catch((e) => console.error("Reminder error:", e.message)), 60000);
  console.log("Reminder scheduler running (every 60s)");
};
