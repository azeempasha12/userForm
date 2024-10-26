const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static("public"));
app.use(express.json()); // Parse incoming JSON data
app.use(cors()); // Enable CORS for all routes

// MongoDB configuration
const url = "mongodb+srv://ishitamalik68:pasha123@cluster0.t3jtoov.mongodb.net/";
const client = new MongoClient(url);
let db;

// POST route to handle form submission
app.post("/submit-form", async (req, res) => {
  const { email, number } = req.body;

  try {
    console.log("Received Form Data:", req.body);

    // Check if the user already exists based on email and number
    let data = await db.collection("googleForm").findOne({ email, number });

    if (data) {
      return res.status(409).send({ message: "This email and mobile number already exist" });
    }

    // If user doesn't exist, insert the new data
    const newData = await db.collection("googleForm").insertOne(req.body);

    console.log("Inserted Data:", newData);
    return res.status(201).send({ success: "Data has been sent successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "An error occurred while saving data" });
  }
});


// GET route to fetch form data for the preview page
app.get("/preview", async (req, res) => {
  try {
    let data = await db.collection("googleForm").find({}).toArray();

    console.log("Fetched Data:", data);
    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Connect to MongoDB and start the server
async function connectToMongoAndStartServer() {
  try {
    await client.connect();
    db = client.db("formData"); // Use the correct database
    console.log("Connected to MongoDB");

    app.listen(3000, () => {
      console.log("Server is listening on port 3000");
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}

// Start the server
connectToMongoAndStartServer();
