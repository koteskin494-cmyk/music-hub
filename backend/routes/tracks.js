const express = require('express');
const Track = require('../models/Track');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const tracks = await Track.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tracks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, genre, notes } = req.body;
    const track = await Track.create({ title, genre, notes, user: req.user.id });
    res.status(201).json(track);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { title, genre, notes } = req.body;
    const track = await Track.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, genre, notes },
      { new: true }
    );
    if (!track) return res.status(404).json({ message: 'Track not found' });
    res.json(track);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const track = await Track.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!track) return res.status(404).json({ message: 'Track not found' });
    res.json({ message: 'Track deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;