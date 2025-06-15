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
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', process.env.FRONTEND_URL].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
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

// Mount admin routes
app.use('/api/admin', adminRoutes);

// Public players endpoint
app.get('/api/players', checkDatabaseConnection, async (req, res) => {
  try {
    console.log('Public players endpoint hit');
    console.log('Database connection state:', mongoose.connection.readyState);
    console.log('Is connected:', isConnected);

    if (!mongoose.connection.readyState === 1) {
      console.log('Database not ready, returning 503');
      return res.status(503).json({ 
        message: 'Database connection not ready',
        state: mongoose.connection.readyState
      });
    }

    console.log('Fetching players from database...');
    const players = await Player.find().sort({ number: 1 });
    console.log(`Found ${players.length} players`);
    
    if (!players || players.length === 0) {
      console.log('No players found in database');
      return res.json([]);
    }

    console.log('Successfully retrieved players');
    res.json(players);
  } catch (error) {
    console.error('Error in /api/players endpoint:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Error fetching players',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Public fixtures endpoint
app.get('/api/fixtures', checkDatabaseConnection, async (req, res) => {
  try {
    console.log('Public fixtures endpoint hit');
    console.log('Database connection state:', mongoose.connection.readyState);
    console.log('Is connected:', isConnected);

    if (!mongoose.connection.readyState === 1) {
      console.log('Database not ready, returning 503');
      return res.status(503).json({ 
        message: 'Database connection not ready',
        state: mongoose.connection.readyState
      });
    }

    console.log('Fetching fixtures from database...');
    const fixtures = await Fixture.find().sort({ date: 1 });
    console.log(`Found ${fixtures.length} fixtures`);
    
    if (!fixtures || fixtures.length === 0) {
      console.log('No fixtures found in database');
      return res.json([]);
    }

    console.log('Successfully retrieved fixtures');
    res.json(fixtures);
  } catch (error) {
    console.error('Error in /api/fixtures endpoint:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Error fetching fixtures',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Public news endpoint
app.get('/api/news', checkDatabaseConnection, async (req, res) => {
  try {
    console.log('Public news endpoint hit');
    console.log('Database connection state:', mongoose.connection.readyState);
    console.log('Is connected:', isConnected);

    if (!mongoose.connection.readyState === 1) {
      console.log('Database not ready, returning 503');
      return res.status(503).json({ 
        message: 'Database connection not ready',
        state: mongoose.connection.readyState
      });
    }

    console.log('Fetching news from database...');
    const news = await News.find().sort({ createdAt: -1 });
    console.log(`Found ${news.length} news articles`);
    
    if (!news || news.length === 0) {
      console.log('No news found in database');
      return res.json([]);
    }

    console.log('Successfully retrieved news');
    res.json(news);
  } catch (error) {
    console.error('Error in /api/news endpoint:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Error fetching news',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Public news detail endpoint
app.get('/api/news/:id', checkDatabaseConnection, async (req, res) => {
  try {
    console.log('Fetching news article:', req.params.id);
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }

    console.log('Found news article:', news.title);
    res.json(news);
  } catch (error) {
    console.error('Error fetching news article:', error);
    res.status(500).json({ message: 'Error fetching news article' });
  }
});

// Public league endpoint
app.get('/api/league', checkDatabaseConnection, async (req, res) => {
  try {
    console.log('Fetching league table...');
    const leagueTable = await League.find().sort({ position: 1 });
    console.log(`Found ${leagueTable.length} teams in the league table`);
    res.json(leagueTable);
  } catch (error) {
    console.error('Error fetching league table:', error);
    res.status(500).json({ message: 'Failed to fetch league table' });
  }
});

// Add a test endpoint to verify server is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// ✅ Register route
app.post("/register", checkDatabaseConnection, async (req, res) => {
    console.log("Registration attempt received");
    
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
        console.log("Missing required fields");
        return res.status(400).json({ 
            message: "All fields are required",
            details: {
                name: !name ? "Name is required" : null,
                email: !email ? "Email is required" : null,
                password: !password ? "Password is required" : null
            }
        });
    }

    try {
        console.log("Checking for existing user");
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("User already exists");
            return res.status(400).json({ message: "User already exists" });
        }

        console.log("Hashing password");
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("Creating new user");
        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword,
            role: "member",
            createdAt: new Date()
        });

        console.log("Saving user");
        await newUser.save();
        console.log("User saved successfully");

        console.log("Generating token");
        const token = jwt.sign(
            { id: newUser._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1d" }
        );

        const userResponse = {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        };

        console.log("Registration successful");
        return res.status(201).json({
            message: "User registered successfully",
            token,
            user: userResponse
        });
    } catch (err) {
        console.error("Registration error:", {
            name: err.name,
            message: err.message,
            code: err.code
        });

        if (err.code === 11000) {
            return res.status(400).json({ 
                message: "Email already exists",
                error: "DUPLICATE_EMAIL"
            });
        }

        return res.status(500).json({ 
            message: "Error registering user", 
            error: err.message
        });
    }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);
    
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('Login failed - User not found');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch ? 'Yes' : 'No');
    
    if (!isMatch) {
      console.log('Login failed - Invalid password');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();
    console.log('Last login updated');

    // Create token with user ID and role
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('Token generated');

    // Send response with token and user data
    const response = {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
    console.log('Login successful - Sending response');
    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Profile route
app.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update Profile route
app.put("/profile", auth, async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user information
        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();

        res.json({
            message: "Profile updated successfully",
            profile: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                updatedAt: new Date()
            }
        });
    } catch (err) {
        console.error("Profile update error:", err);
        res.status(500).json({ message: "Error updating profile" });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
