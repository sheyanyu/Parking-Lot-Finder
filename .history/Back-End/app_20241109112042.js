const express = require('express');
const app = express();
const port = 3000;


const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://sylvia:4xs2pp1R6EVSd8k5@parkinglotfinder.jj5d2.mongodb.net/?retryWrites=true&w=majority&appName=ParkingLotFinder";
const client = new MongoClient(uri);
const database = client.db('parkingdb');
const parking_lot = database.collection('parking_lot');
const unvalidated = database.collection('invalid');

// middleware to parse JSON bodies
app.use(express.json()); // for parsing application/json

// GET
app.get('/items', (req, res) => {
    res.json(result);
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

// POST route to handle form data sent via AJAX
app.post('/items', (req, res) => {
  const  formData = {
    rating: ratingValue,
    price: price,
    occupation: occupation,
    ticket: time
} = req.body; // Get the data from the request body

  console.log('Received data:', rating, price);

});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
