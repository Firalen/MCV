const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const multer = require('multer');
const path = require('path');
const Player = require('../models/Player');
const Fixture = require('../models/Fixture');
const StoreItem = require('../models/StoreItem');
const News = require('../models/News');
const User = require('../models/User');
const fs = require('fs');
const League = require('../models/League');

// Admin stats endpoint
router.get('/stats', auth, admin, async (req, res) => {
  try {
    console.log('Admin stats - User:', req.user);
    const [totalUsers, totalPlayers, totalFixtures, totalNews] = await Promise.all([
      User.countDocuments(),
      Player.countDocuments(),
      Fixture.countDocuments(),
      News.countDocuments()
    ]);

    res.json({
      totalUsers,
      totalPlayers,
      totalFixtures,
      totalNews
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Error fetching admin stats' });
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/players')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
});

// Configure multer for news image uploads
const newsStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/news';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const newsUpload = multer({ 
  storage: newsStorage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
});

// Players routes
router.get('/players', auth, admin, async (req, res) => {
  try {
    const players = await Player.find().sort({ number: 1 });
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/players', auth, admin, upload.single('image'), async (req, res) => {
  try {
    console.log('Received player data:', req.body); // Debug log

    if (!req.file) {
      return res.status(400).json({ message: 'Player image is required' });
    }

    const stats = req.body.stats ? JSON.parse(req.body.stats) : {
      kills: 0,
      aces: 0,
      digs: 0,
      blocks: 0
    };

    // Get positions from request body
    const positions = Array.isArray(req.body.positions) 
      ? req.body.positions 
      : [req.body.positions].filter(Boolean);

    console.log('Processing positions:', positions); // Debug log

    if (!positions || positions.length === 0) {
      return res.status(400).json({ message: 'At least one position must be selected' });
    }

    const player = new Player({
      name: req.body.name,
      positions: positions, // Changed from position to positions
      number: req.body.number,
      age: req.body.age,
      nationality: req.body.nationality,
      image: `/uploads/players/${req.file.filename}`,
      stats: stats
    });

    console.log('Creating player with data:', player); // Debug log

    const newPlayer = await player.save();
    console.log('Player created successfully:', newPlayer); // Debug log
    res.status(201).json(newPlayer);
  } catch (error) {
    console.error('Error adding player:', error);
    res.status(400).json({ message: error.message });
  }
});

router.put('/players/:id', auth, admin, upload.single('image'), async (req, res) => {
  try {
    const { name, number, age, positions, skills } = req.body;
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Update player fields
    player.name = name;
    player.number = number;
    player.age = age;
    player.positions = JSON.parse(positions);
    player.skills = JSON.parse(skills);

    // Update image if a new one is uploaded
    if (req.file) {
      // Delete old image if it exists
      if (player.image) {
        const oldImagePath = path.join(__dirname, '..', player.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      player.image = `uploads/players/${req.file.filename}`;
    }

    await player.save();
    res.json(player);
  } catch (error) {
    console.error('Error updating player:', error);
    res.status(500).json({ message: 'Error updating player', error: error.message });
  }
});

router.delete('/players/:id', auth, admin, async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: 'Player not found' });

    await Player.deleteOne({ _id: req.params.id });
    res.json({ message: 'Player deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fixtures routes
router.get('/fixtures', auth, admin, async (req, res) => {
  try {
    const fixtures = await Fixture.find().sort({ date: 1 });
    res.json(fixtures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/fixtures', auth, admin, async (req, res) => {
  try {
    const { opponent, date, venue, status, competition, score } = req.body;

    // Validate required fields
    if (!opponent || !date || !venue || !status || !competition) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create new fixture
    const fixture = new Fixture({
      opponent,
      date,
      venue,
      status,
      competition,
      score: score || { home: 0, away: 0 }
    });

    await fixture.save();
    res.status(201).json(fixture);
  } catch (error) {
    console.error('Error creating fixture:', error);
    res.status(500).json({ message: 'Error creating fixture', error: error.message });
  }
});

router.put('/fixtures/:id', auth, admin, async (req, res) => {
  try {
    const { opponent, date, venue, status, competition, score } = req.body;

    // Validate required fields
    if (!opponent || !date || !venue || !status || !competition) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const fixture = await Fixture.findById(req.params.id);
    if (!fixture) {
      return res.status(404).json({ message: 'Fixture not found' });
    }

    fixture.opponent = opponent;
    fixture.date = date;
    fixture.venue = venue;
    fixture.status = status;
    fixture.competition = competition;
    fixture.score = score || { home: 0, away: 0 };

    await fixture.save();
    res.json(fixture);
  } catch (error) {
    console.error('Error updating fixture:', error);
    res.status(500).json({ message: 'Error updating fixture', error: error.message });
  }
});

router.delete('/fixtures/:id', auth, admin, async (req, res) => {
  try {
    const fixture = await Fixture.findById(req.params.id);
    if (!fixture) {
      return res.status(404).json({ message: 'Fixture not found' });
    }

    await fixture.deleteOne();
    res.json({ message: 'Fixture deleted successfully' });
  } catch (error) {
    console.error('Error deleting fixture:', error);
    res.status(500).json({ message: 'Error deleting fixture', error: error.message });
  }
});

// Store routes
router.get('/store', auth, admin, async (req, res) => {
  try {
    const items = await StoreItem.find().sort({ name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/store', auth, admin, async (req, res) => {
  const item = new StoreItem({
    name: req.body.name,
    price: req.body.price,
    stock: req.body.stock,
    status: req.body.status,
    description: req.body.description,
    image: req.body.image,
    category: req.body.category,
    sizes: req.body.sizes
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/store/:id', auth, admin, async (req, res) => {
  try {
    const item = await StoreItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    Object.assign(item, req.body);
    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/store/:id', auth, admin, async (req, res) => {
  try {
    const item = await StoreItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    await StoreItem.deleteOne({ _id: req.params.id });
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// News routes
router.get('/news', auth, admin, async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/news', auth, admin, newsUpload.single('image'), async (req, res) => {
  try {
    console.log('Received news data:', req.body);
    console.log('Received file:', req.file);

    const { title, content, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const news = new News({
      title,
      content,
      category: category || 'Other',
      image: req.file ? `/uploads/news/${req.file.filename}` : undefined
    });

    console.log('Creating news with data:', news);

    const newNews = await news.save();
    console.log('News created successfully:', newNews);
    res.status(201).json(newNews);
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({ message: 'Error creating news', error: error.message });
  }
});

router.put('/news/:id', auth, admin, newsUpload.single('image'), async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    // Update news fields
    news.title = title;
    news.content = content;
    news.category = category;

    // Update image if a new one is uploaded
    if (req.file) {
      // Delete old image if it exists
      if (news.image) {
        const oldImagePath = path.join(__dirname, '..', news.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      news.image = `/uploads/news/${req.file.filename}`;
    }

    await news.save();
    res.json(news);
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ message: 'Error updating news', error: error.message });
  }
});

router.delete('/news/:id', auth, admin, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    // Delete image if it exists
    if (news.image) {
      const imagePath = path.join(__dirname, '..', news.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await News.deleteOne({ _id: req.params.id });
    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ message: 'Error deleting news', error: error.message });
  }
});

// Add users route for admin dashboard
router.get('/users', auth, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// League Table Routes
router.post('/league', auth, async (req, res) => {
  try {
    const { teamName, played, wins, losses, points, position } = req.body;
    
    if (!teamName || position === undefined) {
      return res.status(400).json({ message: 'Team name and position are required' });
    }

    const leagueEntry = new League({
      teamName,
      played: played || 0,
      wins: wins || 0,
      losses: losses || 0,
      points: points || 0,
      position
    });

    await leagueEntry.save();
    res.status(201).json(leagueEntry);
  } catch (error) {
    console.error('Error creating league entry:', error);
    res.status(500).json({ message: 'Error creating league entry' });
  }
});

router.put('/league/:id', auth, async (req, res) => {
  try {
    const { teamName, played, wins, losses, points, position } = req.body;
    
    if (!teamName || position === undefined) {
      return res.status(400).json({ message: 'Team name and position are required' });
    }

    const leagueEntry = await League.findByIdAndUpdate(
      req.params.id,
      {
        teamName,
        played: played || 0,
        wins: wins || 0,
        losses: losses || 0,
        points: points || 0,
        position
      },
      { new: true }
    );

    if (!leagueEntry) {
      return res.status(404).json({ message: 'League entry not found' });
    }

    res.json(leagueEntry);
  } catch (error) {
    console.error('Error updating league entry:', error);
    res.status(500).json({ message: 'Error updating league entry' });
  }
});

router.delete('/league/:id', auth, async (req, res) => {
  try {
    const leagueEntry = await League.findByIdAndDelete(req.params.id);
    
    if (!leagueEntry) {
      return res.status(404).json({ message: 'League entry not found' });
    }

    res.json({ message: 'League entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting league entry:', error);
    res.status(500).json({ message: 'Error deleting league entry' });
  }
});

module.exports = router; 