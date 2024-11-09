const express = require('express');
const { MongoClient } = require("mongodb");

const app = express();
const port = 3000;
const uri = "mongodb+srv://sylvia:4xs2pp1R6EVSd8k5@parkinglotfinder.jj5d2.mongodb.net/?retryWrites=true&w=majority&appName=ParkingLotFinder";
const client = new MongoClient(uri);
const cors = require('cors');

let database, parking_lot, unvalidated;

// Middleware to parse JSON bodies
app.use(express.json()); // for parsing application/json
app.use(cors());

// Connect to MongoDB
client.connect()
  .then(() => {
    console.log("Connected to MongoDB");
    database = client.db('parkingdb');
    parking_lot = database.collection('parking_lot');
    unvalidated = database.collection('invalid');
  })
  .catch(error => console.error("Error connecting to MongoDB:", error));


// POST route to handle form data
app.post('/submit', async (req, res) => {
  // Destructure data from the request body
  const {
        rating,
        price,
        occupation,
        ticket,
        ticketTime
    } = req.body;

  // Log received data
  console.log('Received data:', rating, price, occupation, ticket, ticketTime);

  try {
    // Insert the data into the parking_lot collection
    const result = await unvalidated.insertOne({
      rating: Number(rating),
      price: Number(price),
      occupation: Number(occupation),
      ticket: ticket,
      ticketTime: ticket === "yes" ? ticketTime : null
    });

    // Send success response
    res.status(201).json({ message: "Data submitted successfully", insertedId: result.insertedId });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ message: "Error submitting data" });
  }
});

app.get('/items', async (req, res) => {
  try {
    const items = await parking_lot.find().toArray();
    res.json(items);
  } catch (error) {
    console.error("Error retrieving items:", error);
    res.status(500).json({ message: "Error retrieving items" });
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


async function getData(location) {
    try {
        const data = await collection.find({location}).toArray();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

