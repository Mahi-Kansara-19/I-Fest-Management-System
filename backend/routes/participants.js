import express from "express";
import { pool } from "../db/index.js";

const router = express.Router();

// Get all participants
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM participants ORDER BY participant_id ASC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single participant
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM participants WHERE participant_id = $1", [req.params.id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a participant
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, college } = req.body;
    const result = await pool.query(
      "INSERT INTO participants (name, email, phone, college) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, phone, college]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a participant
router.put("/:id", async (req, res) => {
  const { name, email, phone, college } = req.body;
  try {
    const result = await pool.query(
      "UPDATE participants SET name=$1, email=$2, phone=$3, college=$4 WHERE participant_id=$5 RETURNING *",
      [name, email, phone, college, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a participant
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM participants WHERE participant_id = $1", [req.params.id]);
    res.json({ message: "Participant deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
