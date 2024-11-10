const express = require('express');
const { MongoClient } = require("mongodb");

const app = express();
const port = 3000;
const uri = "mongodb+srv://sylvia:4xs2pp1R6EVSd8k5@parkinglotfinder.jj5d2.mongodb.net/?retryWrites=true&w=majority&appName=ParkingLotFinder";
const client = new MongoClient(uri);
const cors = require('cors');

// Middleware to parse JSON bodies
app.use(express.json()); // for parsing application/json
app.use(cors());

let parking_lot, database, unvalidated;

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    database = client.db('parkingdb');
    parking_lot = database.collection('parking_lot');
    unvalidated = database.collection('invalid');
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Generate random data and insert it into the parking_lot collection
async function auto_gen_validDB() {
  function getRandomData() {
    const data = {
      location_id: `loc_${Math.floor(Math.random() * 1000)}`,
      time: Array.from({ length: 7 }, () => Math.floor(Math.random() * 24)),
      occupation: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)),
      ticket: Array.from({ length: 7 }, () => Math.floor(Math.random() * 10)),
      rating: (Math.random() * 5).toFixed(1),
      price: (Math.random() * 20).toFixed(2),
      weekday: Array.from({ length: 7 }, (_, i) => i),
    };
    console.log('Generated data:', data); // Log each generated entry
    return data;
  }

  const data = Array.from({ length: 10 }, getRandomData); // Generate an array of random data
  try {
    if (parking_lot) {
      await parking_lot.insertMany(data);
      console.log("Data inserted successfully");
    } else {
      console.error("parking_lot collection is not defined");
    }
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}

// Main function to run after database connection is established
async function main() {
  await connectToDatabase(); // Wait for the DB connection
  await auto_gen_validDB();  // Generate and insert data after the connection
}

main().catch(console.error); // Run the main function

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
