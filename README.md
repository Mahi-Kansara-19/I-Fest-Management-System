# 🎪 I-Fest Management System
Built a full-stack event management system for managing events, participants, registrations, and venues. Designed and integrated a PostgreSQL database with CRUD functionalities and an admin dashboard. Applied DBMS concepts including relational schema design and normalization.

📄 [SRS Document: ](IFest_SRS.pdf)


## ✨ Key Capabilities

### Participant & Team Management

* Maintain participant records with unique festival IDs.
* Support both solo and team-based registrations.
* Prevent duplicate registrations through validation checks.

### Event Administration

* Create and manage events with configurable capacities.
* Schedule events and assign venues efficiently.
* Monitor registrations in real time.

### Venue Coordination

* Store venue details including seating capacity and available facilities.
* Link venues directly with scheduled events.

### Judging & Evaluation

* Assign judges to specific events.
* Secure score submission and result management.
* Maintain ranking and performance records.

### Certificate Automation

* Generate digital certificates for participants, winners, and volunteers.
* Store certificate metadata for future retrieval.

### Sponsorship & Archives

* Manage sponsor information and sponsorship categories.
* Preserve historical event data and results for future reference.

---

## 👤 Access Levels

| User Type     | Access                                                           |
| ------------- | ---------------------------------------------------------------- |
| Administrator | Complete management of events, users, registrations, and results |
| Judge         | View assigned events and submit scores                           |
| Faculty       | Monitor participants and event schedules                         |
| Sponsor       | Access sponsorship and event-related information                 |
| Visitor       | Browse public festival details                                   |

---

## 🛠 Technology Stack

| Layer     | Technologies                |
| --------- | --------------------------- |
| Frontend  | React, Vite, Tailwind CSS   |
| Backend   | Node.js, Express.js         |
| Database  | PostgreSQL                  |
| Utilities | Axios, dotenv, concurrently |

---

## 🗄 Database Design

The application is powered by a PostgreSQL database designed using normalization principles to minimize redundancy and maintain consistency.

### Core Entities

* Participants
* Events
* Venues
* Teams
* Judges
* Sponsors
* Certificates
* Results

### Supporting Entities

* Registrations
* Event_Judges
* Event_Sponsors
* Feedback
* Archive

### Relationship Highlights

* One venue can host multiple events.
* Participants can register for multiple events.
* Events may have multiple judges and sponsors.
* Teams can contain multiple participants.
* Certificates are linked directly to participants.

---

## 🔒 System Requirements

### Security

* Role-based access control for all users.
* Restricted score submission and administrative operations.

### Reliability

* Validation rules enforce data consistency.
* Unique constraints prevent duplicate records.

### Performance

* Optimized queries for event and registration management.
* Fast response times for common operations.

### Maintainability

* Modular project structure.
* Clear separation of frontend, backend, and database layers.

---

## 📂 Project Structure

```text
IfestApp/
├── backend/
│   ├── db/
│   ├── routes/
│   ├── server.js
│   └── .env
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── App.jsx
├── IFest_SRS.pdf
└── package.json
```

## 🚀 Getting Started

### Prerequisites

* Node.js 18+
* PostgreSQL

### Installation

```bash
git clone <repository-url>
cd I-Fest_Management_System

npm install

cd backend
npm install

cd ../frontend
npm install
```

### Environment Configuration

```env
PORT=5000
PG_USER=postgres
PG_PASSWORD=your_password
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=I-Fest
```

### Run the Application

```bash
npm run dev
```

Frontend: http://localhost:5173

Backend: http://localhost:5000

---

## 📄 Documentation

The complete Software Requirements Specification (SRS) is included in the repository as:

`IFest_SRS.pdf`

---

## 👩‍💻 Contributors

* Mahi Kansara
* Diya Shah
