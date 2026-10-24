import { useEffect, useState } from "react";
import api, { errorText } from "../api";
import { useAuth } from "../AuthContext";
import EventForm from "../components/EventForm";

const when = (iso) =>
  new Date(iso).toLocaleString(undefined, { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const load = () =>
    api.get("/events").then((r) => setEvents(r.data)).catch((e) => setError(errorText(e)));

  useEffect(() => { load(); }, []);

  const save = async (data) => {
    if (editing) await api.put(`/events/${editing._id}`, data);
    else await api.post("/events", data);
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this event?")) return;
    await api.delete(`/events/${id}`);
    load();
  };

  const now = Date.now();
  const upcoming = events.filter((e) => new Date(e.startsAt) >= now);
  const past = events.filter((e) => new Date(e.startsAt) < now);

  return (
    <>
      <header className="top">
        <h1 className="brand small">Eventora</h1>
        <div className="row">
          <span className="muted">{user.name}</span>
          <button className="btn ghost" onClick={logout}>Log out</button>
        </div>
      </header>

      <main className="grid">
        <EventForm key={editing?._id || "new"} editing={editing} onSave={save} onCancel={() => setEditing(null)} />

        <section>
          <h2>Upcoming</h2>
          {error && <p className="error">{error}</p>}
          {upcoming.length === 0 && <p className="muted">Nothing scheduled. Add your first event on the left.</p>}
          <ul className="list">
            {upcoming.map((ev) => (
              <li key={ev._id} className="event">
                <div className="when">{when(ev.startsAt)}</div>
                <div className="body">
                  <h3>{ev.title}</h3>
                  {ev.location && <p className="muted">{ev.location}</p>}
                  {ev.description && <p>{ev.description}</p>}
                  <p className="muted small">
                    {ev.reminderSent ? "Reminder sent" : `Reminder ${ev.reminderMinutes} min before`}
                    {ev.attendees.length > 0 && ` · ${ev.attendees.length} guest(s) emailed`}
                  </p>
                </div>
                <div className="actions">
                  <button className="link" onClick={() => setEditing(ev)}>Edit</button>
                  <button className="link danger" onClick={() => remove(ev._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>

          {past.length > 0 && (
            <>
              <h2 className="past-h">Past</h2>
              <ul className="list past">
                {past.map((ev) => (
                  <li key={ev._id} className="event">
                    <div className="when">{when(ev.startsAt)}</div>
                    <div className="body"><h3>{ev.title}</h3></div>
                    <div className="actions">
                      <button className="link danger" onClick={() => remove(ev._id)}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </main>
    </>
  );
}
