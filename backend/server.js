import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db/index.js';

// Import route files
import eventsRoutes from './routes/events.js';
import participantsRoutes from './routes/participants.js';
import venuesRoutes from './routes/venues.js';
import registrationsRoutes from './routes/registrations.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('✅ I-Fest Backend is running successfully!');
});

// Use your routes
app.use('/api/events', eventsRoutes);
app.use('/api/participants', participantsRoutes);
app.use('/api/venues', venuesRoutes);
app.use('/api/registrations', registrationsRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
