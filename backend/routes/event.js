import express from "express";
import { pool } from "../db/index.js";

const router = express.Router();

// Get all events
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.event_id, e.name, e.date, e.category, v.venue_name, v.capacity
      FROM events e
      LEFT JOIN venues v ON e.venue_id = v.venue_id
      ORDER BY e.event_id ASC;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get single event
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, v.venue_name FROM events e LEFT JOIN venues v ON e.venue_id = v.venue_id WHERE e.event_id = $1`,
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add event
router.post("/", async (req, res) => {
  const { name, date, category, venue_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO events (name, date, category, venue_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, date, category, venue_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update event
router.put("/:id", async (req, res) => {
  const { name, date, category, venue_id } = req.body;
  try {
    const result = await pool.query(
      "UPDATE events SET name=$1, date=$2, category=$3, venue_id=$4 WHERE event_id=$5 RETURNING *",
      [name, date, category, venue_id, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete event
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM events WHERE event_id = $1", [req.params.id]);
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
