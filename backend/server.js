const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dns = require('dns');

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
    origin: 'http://localhost:5173', // Frontend Vite default port
    credentials: true
}));
app.use(express.json());

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
    console.log(`${req.method} ${req.path}`);
    next();
});

// ✅ User schema & model
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'member'], default: 'user' },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date }
});
const User = mongoose.model("User", userSchema);

// Player schema & model
const playerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    position: { 
        type: String, 
        required: true,
        enum: ['Outside Hitter', 'Middle Blocker', 'Opposite Hitter', 'Setter', 'Libero', 'Defensive Specialist']
    },
    number: { type: Number, required: true },
    age: { type: Number, required: true },
    nationality: { type: String, required: true },
    image: { type: String, required: true },
    stats: {
        kills: { type: Number, default: 0 },
        aces: { type: Number, default: 0 },
        digs: { type: Number, default: 0 },
        blocks: { type: Number, default: 0 }
    },
    createdAt: { type: Date, default: Date.now }
});
const Player = mongoose.model('Player', playerSchema);

// Fixture schema & model
const fixtureSchema = new mongoose.Schema({
    opponent: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    competition: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const Fixture = mongoose.model('Fixture', fixtureSchema);

// Store Item schema & model
const storeItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    status: {
        type: String,
        required: true,
        enum: ['In Stock', 'Low Stock', 'Out of Stock'],
        default: 'In Stock'
    },
    description: { type: String, required: true },
    image: { type: String },
    category: {
        type: String,
        required: true,
        enum: ['Jerseys', 'Accessories', 'Equipment']
    },
    sizes: [{
        type: String,
        enum: ['S', 'M', 'L', 'XL', 'XXL']
    }],
    createdAt: { type: Date, default: Date.now }
});
const StoreItem = mongoose.model('StoreItem', storeItemSchema);

// News schema & model
const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const News = mongoose.model('News', newsSchema);

// ✅ Middleware to verify JWT
function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = verified.id;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
}

// Admin middleware
const admin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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

        console.log("Registration successful");
        res.status(201).json({
            message: "User registered successfully",
            token,
            user: { 
                id: newUser._id, 
                name: newUser.name, 
                email: newUser.email,
                role: newUser.role
            }
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

        res.status(500).json({ 
            message: "Error registering user", 
            error: err.message
        });
    }
});

// Login Route
app.post('/login', async (req, res) => {
  console.log('\n=== Login Request ===');
  console.log('Time:', new Date().toISOString());
  console.log('Request body:', { ...req.body, password: '***' });
  
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('Invalid password for user:', email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful for user:', email);
    console.log('User role:', user.role);

    res.json({
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
    res.status(500).json({ message: 'Error during login' });
  }
});

// Profile route
app.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
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
app.put("/profile", verifyToken, async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findById(req.userId);
        
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
                role: user.role || "member",
                updatedAt: new Date()
            }
        });
    } catch (err) {
        console.error("Profile update error:", err);
        res.status(500).json({ message: "Error updating profile" });
    }
});

// Admin Routes
// Players routes
app.get('/api/admin/players', verifyToken, admin, async (req, res) => {
    try {
        const players = await Player.find().sort({ number: 1 });
        res.json(players);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/admin/players', verifyToken, admin, async (req, res) => {
    const player = new Player({
        name: req.body.name,
        position: req.body.position,
        number: req.body.number,
        age: req.body.age,
        nationality: req.body.nationality,
        image: req.body.image
    });

    try {
        const newPlayer = await player.save();
        res.status(201).json(newPlayer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/api/admin/players/:id', verifyToken, admin, async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);
        if (!player) return res.status(404).json({ message: 'Player not found' });

        Object.assign(player, req.body);
        const updatedPlayer = await player.save();
        res.json(updatedPlayer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/admin/players/:id', verifyToken, admin, async (req, res) => {
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
app.get('/api/admin/fixtures', verifyToken, admin, async (req, res) => {
    try {
        const fixtures = await Fixture.find().sort({ date: 1 });
        res.json(fixtures);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/admin/fixtures', verifyToken, admin, async (req, res) => {
    const fixture = new Fixture({
        opponent: req.body.opponent,
        date: req.body.date,
        time: req.body.time,
        venue: req.body.venue,
        competition: req.body.competition
    });

    try {
        const newFixture = await fixture.save();
        res.status(201).json(newFixture);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/api/admin/fixtures/:id', verifyToken, admin, async (req, res) => {
    try {
        const fixture = await Fixture.findById(req.params.id);
        if (!fixture) return res.status(404).json({ message: 'Fixture not found' });

        Object.assign(fixture, req.body);
        const updatedFixture = await fixture.save();
        res.json(updatedFixture);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/admin/fixtures/:id', verifyToken, admin, async (req, res) => {
    try {
        const fixture = await Fixture.findById(req.params.id);
        if (!fixture) return res.status(404).json({ message: 'Fixture not found' });

        await Fixture.deleteOne({ _id: req.params.id });
        res.json({ message: 'Fixture deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Store routes
app.get('/api/admin/store', verifyToken, admin, async (req, res) => {
    try {
        const items = await StoreItem.find().sort({ name: 1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/admin/store', verifyToken, admin, async (req, res) => {
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

app.put('/api/admin/store/:id', verifyToken, admin, async (req, res) => {
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

app.delete('/api/admin/store/:id', verifyToken, admin, async (req, res) => {
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
app.get('/api/admin/news', verifyToken, admin, async (req, res) => {
    try {
        const news = await News.find().sort({ date: -1 });
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/admin/news', verifyToken, admin, async (req, res) => {
    const news = new News({
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
        category: req.body.category
    });

    try {
        const newNews = await news.save();
        res.status(201).json(newNews);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/api/admin/news/:id', verifyToken, admin, async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) return res.status(404).json({ message: 'News not found' });

        Object.assign(news, req.body);
        const updatedNews = await news.save();
        res.json(updatedNews);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/admin/news/:id', verifyToken, admin, async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) return res.status(404).json({ message: 'News not found' });

        await News.deleteOne({ _id: req.params.id });
        res.json({ message: 'News deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Users route for admin
app.get('/api/admin/users', verifyToken, admin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin middleware
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Admin only.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Player routes
app.get('/players', async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching players' });
  }
});

app.post('/players', verifyToken, isAdmin, async (req, res) => {
  try {
    const player = new Player(req.body);
    await player.save();
    res.status(201).json(player);
  } catch (error) {
    res.status(500).json({ message: 'Error creating player' });
  }
});

// Fixture routes
app.get('/fixtures', async (req, res) => {
  try {
    const fixtures = await Fixture.find().sort({ date: 1 });
    res.json(fixtures);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching fixtures' });
  }
});

app.post('/fixtures', verifyToken, isAdmin, async (req, res) => {
  try {
    const fixture = new Fixture(req.body);
    await fixture.save();
    res.status(201).json(fixture);
  } catch (error) {
    res.status(500).json({ message: 'Error creating fixture' });
  }
});

// News routes
app.get('/news', async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news' });
  }
});

app.post('/news', verifyToken, isAdmin, async (req, res) => {
  try {
    const news = new News(req.body);
    await news.save();
    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error creating news' });
  }
});

// Admin Registration Route
app.post('/register-admin', async (req, res) => {
  console.log('\n=== Admin Registration Request ===');
  console.log('Time:', new Date().toISOString());
  console.log('Request body:', { ...req.body, password: '***' });
  console.log('Headers:', req.headers);
  console.log('MongoDB Connection State:', mongoose.connection.readyState);
  
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      console.log('Validation failed - missing fields:', { 
        name: !!name, 
        email: !!email, 
        password: !!password 
      });
      return res.status(400).json({ 
        message: 'All fields are required',
        details: {
          name: !name ? 'Name is required' : null,
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }

    // Check if user already exists
    console.log('Checking for existing user with email:', email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ 
        message: 'User already exists',
        details: 'An account with this email already exists'
      });
    }

    // Hash password
    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin user
    console.log('Creating new admin user...');
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    });

    // Save user
    console.log('Saving user to database...');
    await user.save();
    console.log('Admin user created successfully:', email);

    // Generate token
    console.log('Generating JWT token...');
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Sending success response...');
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('\n❌ Admin registration error:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('MongoDB Connection State:', mongoose.connection.readyState);
    
    res.status(500).json({ 
      message: 'Error creating admin account',
      error: error.message,
      details: error.stack
    });
  }
});

// Check Admin Accounts Route (for debugging)
app.get('/check-admin-accounts', async (req, res) => {
  try {
    const adminUsers = await User.find({ role: 'admin' }).select('-password');
    console.log('Found admin users:', adminUsers);
    res.json({ adminUsers });
  } catch (error) {
    console.error('Error checking admin accounts:', error);
    res.status(500).json({ message: 'Error checking admin accounts' });
  }
});

// Admin Login Route
app.post('/admin/login', async (req, res) => {
  console.log('\n=== Admin Login Request ===');
  console.log('Time:', new Date().toISOString());
  console.log('Request body:', { ...req.body, password: '***' });
  console.log('Headers:', req.headers);
  console.log('MongoDB Connection State:', mongoose.connection.readyState);
  
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing credentials:', { email: !!email, password: !!password });
      return res.status(400).json({ 
        message: 'Email and password are required',
        details: {
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }

    // Find user
    console.log('Looking for user with email:', email);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    console.log('User found:', {
      id: user._id,
      email: user.email,
      role: user.role,
      hasPassword: !!user.password
    });

    // Check if user is admin
    if (user.role !== 'admin') {
      console.log('User is not an admin:', email);
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Check password
    console.log('Verifying password...');
    const validPassword = await bcrypt.compare(password, user.password);
    console.log('Password verification result:', validPassword);
    
    if (!validPassword) {
      console.log('Invalid password for admin:', email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Update last login
    console.log('Updating last login...');
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    console.log('Generating JWT token...');
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Admin login successful:', email);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('\n❌ Admin login error:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('MongoDB Connection State:', mongoose.connection.readyState);
    
    res.status(500).json({ 
      message: 'Error during admin login',
      error: error.message,
      details: error.stack
    });
  }
});

// Get all fans (members)
app.get('/fans', async (req, res) => {
    try {
        const fans = await User.find({ role: 'member' })
            .select('-password')
            .sort({ createdAt: -1 });
        res.json(fans);
    } catch (error) {
        console.error('Error fetching fans:', error);
        res.status(500).json({ message: 'Error fetching fans' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- POST /admin/login');
  console.log('- GET /check-admin-accounts');
  console.log('- POST /register-admin');
  console.log('- POST /login');
  console.log('- POST /register');
});
