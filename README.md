# Eventora

MERN event scheduler: sign up, schedule events by date and time, and get emailed a confirmation and a reminder.

Stack: MongoDB, Express, React (Vite), Node, dotenv, cors, nodemailer, JWT + bcrypt auth.

## Setup (Node 18+ and a running MongoDB, local or Atlas)

```bash
# API
cd server
npm install
cp .env.example .env     # edit values
npm run dev              # http://localhost:5000

# Client (new terminal)
cd client
npm install
cp .env.example .env
npm run dev              # http://localhost:5173
```

## Email (Gmail)
Turn on 2-step verification, create an App Password, and put it in SMTP_PASS.
If SMTP is not set, the app still works; emails are skipped with a console warning.

## API
- POST /api/auth/register, POST /api/auth/login, GET /api/auth/me
- GET/POST /api/events, PUT/DELETE /api/events/:id (all need `Authorization: Bearer <token>`)

## Reminders
server/utils/reminders.js checks every minute. When startsAt minus reminderMinutes has passed,
it emails the owner and guests once, then sets reminderSent.
