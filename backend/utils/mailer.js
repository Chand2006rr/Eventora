const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

async function sendMail({ to, subject, html }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP not configured; skipping email to", to);
    return;
  }
  try {
    await transporter.sendMail({ from: process.env.MAIL_FROM, to, subject, html });
  } catch (err) {
    console.error("Email failed:", err.message);
  }
}

const fmt = (d) =>
  new Date(d).toLocaleString("en-IN", { dateStyle: "full", timeStyle: "short" });

const eventHtml = (heading, ev) => `
  <div style="font-family:Arial,sans-serif;max-width:480px">
    <h2>${heading}</h2>
    <h3 style="margin-bottom:4px">${ev.title}</h3>
    <p style="margin:2px 0"><b>When:</b> ${fmt(ev.startsAt)}</p>
    ${ev.location ? `<p style="margin:2px 0"><b>Where:</b> ${ev.location}</p>` : ""}
    ${ev.description ? `<p>${ev.description}</p>` : ""}
    <p style="color:#888">Sent by Eventora</p>
  </div>`;

exports.sendMail = sendMail;
exports.sendScheduledMail = (to, ev) =>
  sendMail({ to, subject: `Scheduled: ${ev.title}`, html: eventHtml("Your event is scheduled", ev) });
exports.sendReminderMail = (to, ev) =>
  sendMail({ to, subject: `Reminder: ${ev.title}`, html: eventHtml("Starting soon", ev) });
