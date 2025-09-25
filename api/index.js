// server.js
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // parse JSON bodies

// MongoDB connection
const CONNECTION_STRING = "mongodb+srv://Admin1:SherrrDC%401235@cluster0.ayzn8gl.mongodb.net/tourbucketlist?retryWrites=true&w=majority";
const DATABASENAME = "tourbucketlist";
let database;

// Connect to MongoDB
MongoClient.connect(CONNECTION_STRING)
    .then(client => {
        database = client.db(DATABASENAME);
        console.log("MongoDB connected to " + DATABASENAME);
    })
    .catch(err => console.error("MongoDB connection failed:", err));

// Routes

// Test server
app.get("/ping", (req, res) => res.send("Server is alive!"));

// Get all bucket list items
app.get("/tourbucketlist", async (req, res) => {
    if (!database) return res.status(500).send({ error: "Database not connected yet" });
    try {
        const result = await database.collection("tourbucketlistcollection").find({}).toArray();
        console.log("Fetched documents:", result);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to fetch bucket list" });
    }
});

// Get a single item by ID
app.get("/tourbucketlist/:id", async (req, res) => {
    if (!database) return res.status(500).send({ error: "Database not connected yet" });
    try {
        const item = await database.collection("tourbucketlistcollection").findOne({ _id: new ObjectId(req.params.id) });
        if (!item) return res.status(404).send({ error: "Item not found" });
        res.send(item);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to fetch item" });
    }
});

// Add a new bucket list item
app.post("/tourbucketlist", async (req, res) => {
    if (!database) return res.status(500).send({ error: "Database not connected yet" });
    try {
        const newItem = req.body; // { title, description, rating, etc. }
        const result = await database.collection("tourbucketlistcollection").insertOne(newItem);
        res.send({ message: "Item added", id: result.insertedId });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to add item" });
    }
});

// Update an existing bucket list item
app.put("/tourbucketlist/:id", async (req, res) => {
    if (!database) return res.status(500).send({ error: "Database not connected yet" });
    try {
        const updatedItem = req.body;
        const result = await database.collection("tourbucketlistcollection").updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updatedItem }
        );
        if (result.matchedCount === 0) return res.status(404).send({ error: "Item not found" });
        res.send({ message: "Item updated" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to update item" });
    }
});

// Delete a bucket list item
app.delete("/tourbucketlist/:id", async (req, res) => {
    if (!database) return res.status(500).send({ error: "Database not connected yet" });
    try {
        const result = await database.collection("tourbucketlistcollection").deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) return res.status(404).send({ error: "Item not found" });
        res.send({ message: "Item deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to delete item" });
    }
});

// Start server
const PORT = 5038;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));