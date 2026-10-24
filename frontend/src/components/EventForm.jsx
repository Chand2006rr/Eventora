import { useState } from "react";
import { errorText } from "../api";

// <input type="datetime-local"> needs "YYYY-MM-DDTHH:mm" in local time
const toLocalInput = (iso) => {
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

const blank = { title: "", description: "", location: "", startsAt: "", reminderMinutes: 30, attendees: "" };

export default function EventForm({ editing, onSave, onCancel }) {
  const [form, setForm] = useState(
    editing
      ? { ...editing, startsAt: toLocalInput(editing.startsAt), attendees: editing.attendees.join(", ") }
      : blank
  );
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await onSave({ ...form, startsAt: new Date(form.startsAt).toISOString() });
    } catch (err) {
      setError(errorText(err));
    }
  };

  return (
    <form onSubmit={submit} className="card stack">
      <h2>{editing ? "Edit event" : "Schedule an event"}</h2>
      <label>Title
        <input required value={form.title} onChange={set("title")} />
      </label>
      <label>Date and time
        <input type="datetime-local" required value={form.startsAt} onChange={set("startsAt")} />
      </label>
      <label>Location
        <input value={form.location} onChange={set("location")} />
      </label>
      <label>Notes
        <textarea rows={3} value={form.description} onChange={set("description")} />
      </label>
      <label>Remind me
        <select value={form.reminderMinutes} onChange={set("reminderMinutes")}>
          <option value={10}>10 minutes before</option>
          <option value={30}>30 minutes before</option>
          <option value={60}>1 hour before</option>
          <option value={1440}>1 day before</option>
        </select>
      </label>
      <label>Also email (comma-separated)
        <input placeholder="ana@mail.com, raj@mail.com" value={form.attendees} onChange={set("attendees")} />
      </label>
      {error && <p className="error">{error}</p>}
      <div className="row">
        <button className="btn">{editing ? "Save changes" : "Schedule event"}</button>
        {editing && <button type="button" className="btn ghost" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
