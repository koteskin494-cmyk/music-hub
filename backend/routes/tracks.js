const express = require('express');
const Track = require('../models/Track');
const auth = require('../middleware/auth');

const router = express.Router();


router.get('/', auth, async (req, res) => {
  try {
    const { search, sortBy, order } = req.query;
    
  
    let query = { user: req.user.id };
    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { genre: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }
    
  
    const allowedSortFields = ['title', 'genre', 'createdAt', 'updatedAt'];
    let sort = { createdAt: -1 }; 
    if (sortBy && allowedSortFields.includes(sortBy)) {
      sort = { [sortBy]: order === 'asc' ? 1 : -1 };
    }
    
    const tracks = await Track.find(query).sort(sort);
    res.json(tracks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/', auth, async (req, res) => {
  try {
    const { title, genre, notes } = req.body;
    
    if (!title || title.trim().length < 1) {
      return res.status(400).json({ message: 'Название трека обязательно' });
    }
    if (title.length > 100) {
      return res.status(400).json({ message: 'Название не более 100 символов' });
    }
    
    const track = await Track.create({
      title: title.trim(),
      genre: genre || 'Other',
      notes: notes || '',
      user: req.user.id
    });
    res.status(201).json(track);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put('/:id', auth, async (req, res) => {
  try {
    const { title, genre, notes } = req.body;
    
    if (!title || title.trim().length < 1) {
      return res.status(400).json({ message: 'Название трека обязательно' });
    }
    if (title.length > 100) {
      return res.status(400).json({ message: 'Название не более 100 символов' });
    }
    
    const track = await Track.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title: title.trim(), genre: genre || 'Other', notes: notes || '' },
      { new: true, runValidators: true }
    );
    
    if (!track) {
      return res.status(404).json({ message: 'Трек не найден' });
    }
    res.json(track);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Неверный ID трека' });
    }
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


router.get('/:id', auth, async (req, res) => {
  try {
    const track = await Track.findOne({ _id: req.params.id, user: req.user.id });
    if (!track) {
      return res.status(404).json({ message: 'Трек не найден' });
    }
    res.json(track);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Неверный ID трека' });
    }
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;