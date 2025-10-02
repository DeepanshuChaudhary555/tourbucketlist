const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = "your-secret-key-change-this-in-production";

// MongoDB connection
const CONNECTION_STRING = "mongodb+srv://Admin1:SherrrDC%401235@cluster0.ayzn8gl.mongodb.net/tourbucketlist?retryWrites=true&w=majority";
const DATABASENAME = "tourbucketlist";
let database;

// Initialize database with proper schema and indexes
const initializeDatabase = async () => {
    try {
        // Create indexes for users collection
        await database.collection("users").createIndex({ email: 1 }, { unique: true });
        await database.collection("users").createIndex({ username: 1 });
        
        // Create indexes for trips collection
        await database.collection("tourbucketlistcollection").createIndex({ userId: 1 });
        await database.collection("tourbucketlistcollection").createIndex({ createdAt: -1 });
        
        console.log("Database indexes created successfully");
    } catch (err) {
        console.error("Error creating database indexes:", err);
    }
};

MongoClient.connect(CONNECTION_STRING)
    .then(async client => {
        database = client.db(DATABASENAME);
        console.log("MongoDB connected to " + DATABASENAME);
        
        // Initialize database schema
        await initializeDatabase();
    })
    .catch(err => console.error("MongoDB connection failed:", err));

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

// User Registration
app.post("/signup", async (req, res) => {
    if (!database) return res.status(500).send({ error: "Database not connected yet" });
    
    try {
        const { username, email, password } = req.body;
        
        // Input validation
        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        
        if (username.length < 3) {
            return res.status(400).json({ error: "Username must be at least 3 characters long" });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Please enter a valid email address" });
        }
        
        // Check if user already exists
        const existingUser = await database.collection("users").findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ error: "User already exists with this email" });
            } else {
                return res.status(400).json({ error: "Username is already taken" });
            }
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user with proper schema
        const newUser = {
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            profile: {
                joinDate: new Date(),
                totalTrips: 0,
                visitedCountries: []
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await database.collection("users").insertOne(newUser);
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: result.insertedId, email, username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: "User created successfully",
            user: { id: result.insertedId, username, email },
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create user" });
    }
});

// User Login
app.post("/login", async (req, res) => {
    if (!database) return res.status(500).send({ error: "Database not connected yet" });
    
    try {
        const { email, password } = req.body;
        
        // Input validation
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        
        // Find user (case-insensitive email)
        const user = await database.collection("users").findOne({ 
            email: email.toLowerCase().trim() 
        });
        
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Update last login
        await database.collection("users").updateOne(
            { _id: user._id },
            { $set: { lastLogin: new Date() } }
        );

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, username: user.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: "Login successful",
            user: { 
                id: user._id, 
                username: user.username, 
                email: user.email,
                profile: user.profile
            },
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to login" });
    }
});

// Get User Profile
app.get("/profile", verifyToken, async (req, res) => {
    if (!database) return res.status(500).send({ error: "Database not connected yet" });
    
    try {
        const user = await database.collection("users").findOne(
            { _id: new ObjectId(req.user.userId) },
            { projection: { password: 0 } } // Exclude password from response
        );
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        // Get user's trip statistics
        const tripCount = await database.collection("tourbucketlistcollection").countDocuments({ 
            userId: req.user.userId 
        });
        
        res.json({
            user: {
                ...user,
                profile: {
                    ...user.profile,
                    totalTrips: tripCount
                }
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});

app.get("/tourbucketlist", verifyToken, async (req, res) => {
    if (!database) return res.status(500).send({ error: "Database not connected yet" });
    try {
        // Only fetch trips for the logged-in user
        const result = await database.collection("tourbucketlistcollection").find({ userId: req.user.userId }).toArray();
        console.log("Fetched documents:", result);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to fetch bucket list" });
    }
});

app.get("/tourbucketlist/:id", verifyToken, async (req, res) => {
    if (!database) return res.status(500).send({ error: "Database not connected yet" });
    try {
        const item = await database.collection("tourbucketlistcollection").findOne({ 
            _id: new ObjectId(req.params.id),
            userId: req.user.userId 
        });
        if (!item) return res.status(404).send({ error: "Item not found" });
        res.send(item);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to fetch item" });
    }
});

// Addition
app.post("/tourbucketlist", verifyToken, async (req, res) => {
    if (!database) return res.status(500).send({ error: "Database not connected yet" });
    try {
        const newItem = {
            ...req.body,
            userId: req.user.userId,
            username: req.user.username,
            createdAt: new Date()
        };
        const result = await database.collection("tourbucketlistcollection").insertOne(newItem);
        res.send({ message: "Item added", id: result.insertedId });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to add item" });
    }
});

// Updation
app.put("/tourbucketlist/:id", verifyToken, async (req, res) => {
    if (!database) return res.status(500).send({ error: "Database not connected yet" });
    try {
        const updatedItem = req.body;
        const result = await database.collection("tourbucketlistcollection").updateOne(
            { _id: new ObjectId(req.params.id), userId: req.user.userId },
            { $set: updatedItem }
        );
        if (result.matchedCount === 0) return res.status(404).send({ error: "Item not found" });
        res.send({ message: "Item updated" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to update item" });
    }
});

// Deletion
app.delete("/tourbucketlist/:id", verifyToken, async (req, res) => {
    if (!database) return res.status(500).send({ error: "Database not connected yet" });
    try {
        const result = await database.collection("tourbucketlistcollection").deleteOne({ 
            _id: new ObjectId(req.params.id), 
            userId: req.user.userId 
        });
        if (result.deletedCount === 0) return res.status(404).send({ error: "Item not found" });
        res.send({ message: "Item deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to delete item" });
    }
});

// Get Database Schema Info (for development/debugging)
app.get("/schema", async (req, res) => {
    if (!database) return res.status(500).send({ error: "Database not connected yet" });
    
    try {
        const collections = await database.listCollections().toArray();
        const schema = {};
        
        for (const collection of collections) {
            const collectionName = collection.name;
            const sampleDoc = await database.collection(collectionName).findOne();
            const indexes = await database.collection(collectionName).indexes();
            
            schema[collectionName] = {
                sampleDocument: sampleDoc,
                indexes: indexes,
                documentCount: await database.collection(collectionName).countDocuments()
            };
        }
        
        res.json({
            database: DATABASENAME,
            collections: schema
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch schema" });
    }
});

const PORT = 5038;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));