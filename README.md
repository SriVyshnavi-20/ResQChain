<<<<<<< HEAD
# ResQChain: Disaster Response Platform (Full Stack)

React + TypeScript + Tailwind frontend (unchanged design) with a new **Node.js / Express / SQLite** backend.
Four roles share one live system: **Victim, Volunteer, NGO, Government Official**.

## Quick start

Requires **Node.js 22.13 or newer** (check with `node -v`). The database uses Node's built-in SQLite, so there is nothing native to compile and no Visual Studio / Python / build tools are needed on Windows.

```bash
npm install
npm run dev          # API on :4000 + web app on :3000 (opens the browser)
```

The database is created automatically on first start (`server/data/resqchain.db`) with shared starter data only
(relief shelters, disaster zones, partner agencies, a few notices). **There are no built-in accounts.**

### Getting in: register first, then log in

1. Open http://localhost:3000/login and click **Sign Up** (or go to `/register`).
2. Pick your role, enter your name, your own email and a password (8+ characters), and create the account.
3. You are sent back to the Login page. Log in with the same email, password and role.

Tip: to see the roles work together, register a **Victim** in one browser and a **Volunteer** in a private window (use different emails), submit a request as the Victim, and accept it as the Volunteer.

**NGO and Government accounts:** in development anyone can register them (so you can test every role). In production, sign-up for these two roles is disabled unless you set `NGO_INVITE_CODE` / `GOV_INVITE_CODE` in `.env`; people then enter that code on the Sign Up form.

### Other commands

| Command | What it does |
|---|---|
| `npm run seed` | **Wipe everything (all accounts and requests)** and reload the starter shelters/zones/agencies |
| `npm run build` | Typecheck frontend + backend, build the frontend into `dist/` |
| `npm start` | Production: Express serves `dist/` **and** the API on one port (`PORT`, default 4000) |
| `npm run typecheck` | TypeScript check for both sides |
| `npm run test:api` | 77 end-to-end API checks. Start the server on an empty database first (it registers its own test accounts) |

## How the pieces connect

```
 src/ (React)                          server/ (Express + SQLite)
 pages -> useAuth() -> src/lib/api.ts -- HTTP /api --> routes -> services -> db.ts
          (AuthContext)                  JWT auth, role checks, validation (zod)
```

The frontend already routed all state through `AuthContext`, so the backend was added behind that same interface.
`AuthContext` now loads everything the signed-in role needs from one endpoint (`GET /api/bootstrap`), and every action calls the API and re-syncs.

### What is live now

* **Auth**: real login (bcrypt + JWT), session restore on reload, "Remember me", route guards per role, auto sign-out on expired sessions.
* **Victim -> Volunteer -> NGO/Government are one connected workflow.** A submitted request (or SOS) enters the volunteer dispatch pool. A volunteer accepting / starting / completing updates the victim's tracking timeline and status. NGOs dispatch supplies (deducting real inventory) or fulfil; government escalates to NDRF, routes to NGOs, resolves.
* **SOS works without logging in** (landing page button). It creates a Critical request plus an SOS record, with GPS coordinates when the browser allows.
* **Shelters**: reservations adjust live occupancy (family-size aware, one reservation per person, moving releases the old one); government can expand capacity and record safety audits. Status (Available / Near Full / Full) is computed.
* **Inventory** (NGO): add, restock, dispatch with guarded stock (never negative); dispatch history feeds the reports.
* **Government**: zones, agencies, official alert broadcasts, coordination actions (audit-logged), and a **Reports page with live analytics and real CSV / PDF SITREP downloads**.
* **Dashboards**: tiles that were hardcoded (e.g. "19 Open", "1,840 Distress Calls") now come from the database.
* Profile and settings changes persist; nearest shelter is computed.

### Rules the backend enforces

* Role isolation: victims see only their own requests; volunteers never see victim contact data; only government can broadcast alerts, export reports, or change zones; only NGOs touch inventory.
* A volunteer assignment can be claimed by **one** volunteer only (atomic claim). OFFLINE volunteers cannot accept. "Decline" hides a ticket for that volunteer only.
* Requests cannot be fulfilled/cancelled twice; inventory cannot go negative; duplicate emails are rejected.
* Rate limiting on login, sign-up, password reset and SOS; Helmet security headers + CSP; request validation on every endpoint; CSV export is protected against spreadsheet formula injection.

## Troubleshooting (Windows)

* `'concurrently' is not recognized`: `npm install` did not finish. Delete the `node_modules` folder and run `npm install` again.
* `EPERM ... rmdir` warnings during install: something is locking the folder (antivirus, OneDrive sync, VS Code file watcher). Close editors/terminals using the folder, delete `node_modules`, and reinstall. Extracting the project to a short path such as `C:\dev\ResQChain` (not inside OneDrive) avoids most of these.
* Port 3000/4000 already in use: copy `.env.example` to `.env` and change `PORT`.

## Configuration

Everything has a development default. For production copy `.env.example` to `.env` and **set `JWT_SECRET`** (the server refuses to start without it in production).

```bash
npm run build
NODE_ENV=production JWT_SECRET=<long random string> npm start
```


## API overview (`/api`)

| Area | Endpoints |
|---|---|
| Auth | `POST /auth/login` `register` `forgot-password` `reset-password` `change-password` · `GET /auth/me` |
| Session data | `GET /bootstrap` (role-scoped) · `PATCH /me` · `PUT /me/preferences` `/me/safe` `/me/availability` |
| Requests | `POST /requests` · `GET /requests[/:id]` · `POST /requests/:id/` `cancel` `fulfill` `escalate` `route-ngo` `dispatch-supplies` `deploy-volunteers` |
| SOS | `POST /sos` (public) |
| Shelters | `GET /shelters` (public) · `POST /shelters/:id/` `reserve` `expand` `audit` |
| Announcements | `GET /announcements` (public) · `POST /announcements` (government) |
| Volunteer | `GET /assignments` · `POST /assignments/:id/` `accept` `start` `complete` `reject` · `GET/POST /volunteer-tasks...` |
| NGO | `GET/POST /inventory` · `POST /inventory/:id/restock` `dispatch` · `GET /ngo/volunteers` `camps` · `PATCH /ngo/volunteers/:id` |
| Government | `GET /gov/zones` `agencies` `audit-log` · `PATCH /gov/zones/:id/status` `/gov/agencies/:id/sector` · `POST /gov/coordination/...` |
| Reports | `GET /reports/summary` · `GET /reports/export?format=csv\|pdf` |

Errors are always `{ "error": { "message", "code" } }` with a proper HTTP status.

## Things worth knowing

* **Forgot Password** still shows its original placeholder toast: the `forgot-password` / `reset-password` endpoints work, but no email provider is configured, so there is no way to deliver the reset link yet (in development the API returns the token directly).
* **Everything starts empty** (no requests, no inventory, zero counts) and fills up as people register and use the app.
* Report metric definitions: *Timely response coverage* = share of non-cancelled Critical/High requests that have a responder; *Avg response time* = request created -> responder matched; *People assisted* = total evacuated across disaster zones.
* Volunteer "distance" for new tickets is a stable placeholder value until proximity matching is added. Citizen GPS coordinates are stored with requests/SOS, ready for that.
* Dark-mode preference is saved, but the original UI has no dark theme styles, so it has no visual effect yet.
* Data is SQLite via Node's built-in `node:sqlite` (single file, zero setup, WAL mode; Node prints a harmless "SQLite is an experimental feature" notice on start). The `db.ts` / SQL layer is the only part to change if you later move to PostgreSQL.

## Project layout

```
server/            Express API
  index.ts app.ts  entry + middleware/security
  db.ts            SQLite schema + id sequences
  seed.ts          starter shelters / zones / agencies (no accounts)
  routes/          one file per area
  services/        request lifecycle, supplies, stats, reports
  lib/             auth, validation, serializers, timeline, time formatting
src/               React app (design unchanged)
  context/AuthContext.tsx   all state, now API-backed
  lib/api.ts geo.ts         fetch client, geolocation helper
  components/auth/ProtectedRoute.tsx
scripts/api-test.mjs        end-to-end API checks
```
=======
# ResQChain
ResQChain is a web-based disaster management platform designed to connect disaster victims, volunteers, NGOs, and government officials on a single platform. It helps victims report emergencies, submit SOS requests, locate nearby relief shelters, reserve shelter spaces, and track their requests.
>>>>>>> 0803b3d8d51813b24336d1c13c98c40228ffcf88
