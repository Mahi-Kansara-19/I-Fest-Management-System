import express from 'express';
import { pool } from '../db/index.js';

const router = express.Router();

// Get all venues
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Venues ORDER BY venue_id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single venue
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM venues WHERE venue_id = $1', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a venue
router.post('/', async (req, res) => {
  const { venue_name, capacity, location } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Venues (venue_name, capacity, location) VALUES ($1, $2, $3) RETURNING *',
      [venue_name, capacity, location]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a venue
router.put('/:id', async (req, res) => {
  const { venue_name, capacity, location } = req.body;
  try {
    const result = await pool.query(
      'UPDATE venues SET venue_name=$1, capacity=$2, location=$3 WHERE venue_id=$4 RETURNING *',
      [venue_name, capacity, location, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a venue
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM venues WHERE venue_id = $1', [req.params.id]);
    res.json({ message: 'Venue deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
