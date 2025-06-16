const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dns = require('dns');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('./middleware/auth');
const admin = require('./middleware/admin');
const User = require('./models/User');
const Player = require('./models/Player');
const Fixture = require('./models/Fixture');
const StoreItem = require('./models/StoreItem');
const News = require('./models/News');
const League = require('./models/League');

// Load environment variables
dotenv.config();

// Configure DNS to use Google's servers
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Debug environment variables
console.log("Environment check:");
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("MONGO_URI first 20 chars:", process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 20) + "..." : "not set");
console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173', // Vite dev server
  'http://localhost:3000', // Local frontend
  'https://mugher-cement-vc.onrender.com', // Production frontend
  'https://mcv-7x6t.onrender.com' // Production backend
];

// Enable CORS for all routes
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      console.log('CORS blocked request from origin:', origin);
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    console.log('CORS allowed request from origin:', origin);
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
}));

// Handle preflight requests
app.options('*', cors());

// Add body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}
if (!fs.existsSync('uploads/players')) {
  fs.mkdirSync('uploads/players');
}
if (!fs.existsSync('uploads/news')) {
  fs.mkdirSync('uploads/news');
}

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/players', express.static(path.join(__dirname, 'uploads/players')));
app.use('/uploads/news', express.static(path.join(__dirname, 'uploads/news')));

// MongoDB connection with improved settings
console.log("Setting up MongoDB connection...");

let isConnected = false;

const connectWithRetry = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        console.log("Attempting to connect to MongoDB...");

        const options = {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 30000,
            family: 4,
            maxPoolSize: 10,
            minPoolSize: 5,
            retryWrites: true,
            w: 'majority'
        };

        // Connect to MongoDB
        await mongoose.connect(mongoUri, options);
        console.log("✅ Connected to MongoDB successfully");
        isConnected = true;

        // Wait for the connection to be ready
        if (mongoose.connection.readyState === 1) {
            console.log("Connection is ready");
        } else {
            console.log("Connection not fully established yet");
        }
        
    } catch (err) {
        console.error("❌ MongoDB connection error details:");
        console.error("Error name:", err.name);
        console.error("Error message:", err.message);
        console.error("Error code:", err.code);
        isConnected = false;
        
        if (err.name === 'MongoServerSelectionError') {
            console.error("Server selection error - possible causes:");
            console.error("1. MongoDB server is not running");
            console.error("2. Network connectivity issues");
            console.error("3. IP address not whitelisted in MongoDB Atlas");
            console.error("4. Invalid connection string");
        }
        
        console.log("Retrying connection in 5 seconds...");
        setTimeout(connectWithRetry, 5000);
    }
};

// Start the connection process
connectWithRetry();

// Connection event listeners with more detailed state logging
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
    console.log('Connection state:', mongoose.connection.readyState);
    isConnected = true;
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
    console.error('Connection state:', mongoose.connection.readyState);
    isConnected = false;
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
    console.log('Connection state:', mongoose.connection.readyState);
    isConnected = false;
    console.log("Attempting to reconnect...");
    connectWithRetry();
});

// Middleware to check database connection with more detailed state
const checkDatabaseConnection = (req, res, next) => {
    if (!isConnected || mongoose.connection.readyState !== 1) {
        return res.status(503).json({ 
            message: "Database connection not ready. Please try again in a few seconds.",
            error: "Database connection not established",
            state: mongoose.connection.readyState
        });
    }
    next();
};

// Debug middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - Headers:`, req.headers);
    next();
});

// Import admin routes
const adminRoutes = require('./routes/admin');

// Mount admin routes with proper path
app.use('/api/admin', adminRoutes);

// Public routes with proper path parameters
app.get('/api/players', checkDatabaseConnection, async (req, res) => {
  try {
    const players = await Player.find().sort({ number: 1 });
    res.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ message: 'Error fetching players' });
  }
});

app.get('/api/fixtures', checkDatabaseConnection, async (req, res) => {
  try {
    const fixtures = await Fixture.find().sort({ date: 1 });
    res.json(fixtures);
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    res.status(500).json({ message: 'Error fetching fixtures' });
  }
});

app.get('/api/news', checkDatabaseConnection, async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Error fetching news' });
  }
});

app.get('/api/news/:id([0-9a-fA-F]{24})', checkDatabaseConnection, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }
    res.json(news);
  } catch (error) {
    console.error('Error fetching news article:', error);
    res.status(500).json({ message: 'Error fetching news article' });
  }
});

app.get('/api/league', checkDatabaseConnection, async (req, res) => {
  try {
    const leagueTable = await League.find().sort({ position: 1 });
    res.json(leagueTable);
  } catch (error) {
    console.error('Error fetching league table:', error);
    res.status(500).json({ message: 'Failed to fetch league table' });
  }
});

// Auth routes with proper path parameters
app.post('/api/register', checkDatabaseConnection, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'member',
      createdAt: new Date()
    });

    await newUser.save();
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

app.post('/api/login', checkDatabaseConnection, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
