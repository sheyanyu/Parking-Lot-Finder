const express = require('express');
const app = express();
const port = 3000;


const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://sylvia:4xs2pp1R6EVSd8k5@parkinglotfinder.jj5d2.mongodb.net/?retryWrites=true&w=majority&appName=ParkingLotFinder";
const client = new MongoClient(uri);
const database = client.db('parkingdb');
const parking_lot = database.collection('parking_lot');
const unvalidated = database.collection('invalid');


async function find(query) {

    try {
  
      const result = await parking_lot.findOne(query);
      console.log(result)
      // Middleware to parse JSON request bodies
      app.use(express.json());

      // API endpoint to GET all items in the dataset
      app.get('/items', (req, res) => {
        res.json(result);
      });

      // Start the server
      app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
      });
            
    } finally {
  
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }

//  find();
 
  async function write({
    location: [lat,lon],
    price: price_input,
    occupation: occupation_input
  }) {
    try {
        // 10 random records generation
        const generateRandomDocument = () => ({
            _id: Math.floor(Math.random() * 100) + 1,
            location: [Math.floor(Math.random() * 100) + 1,Math.floor(Math.random() * 100) + 1], // Generates a new ObjectId
            price: Math.floor(Math.random() * 100) + 1, // Random price between 1 and 100
            occupation: Math.floor(Math.random() * 100), // Random occupation percentage between 0 and 100
        });

        // // Generate an array of 10 random documents
        // const randomDocuments = Array.from({ length: 10 }, generateRandomDocument);

        // // Insert the documents into MongoDB
        // const result = await unvalidated.insertMany(randomDocuments);
        
        const result = await unvalidated.insertOne({
          location: [lat,lon],
          price: price_input,
          occupation: occupation_input
        });

        console.log(result); 

    } finally {

        await client.close(); 

    }

}

// write({
//   location: [1,1],
//   price: 2,
//   occupation: 3
// }).catch(console.dir);
async function get(){

// middleware to parse JSON bodies
app.use(express.json()); // for parsing application/json

// POST route to handle form data sent via AJAX
app.post('/add-item', (req, res) => {
  const  formData = {
    rating: ratingValue,
    price: price,
    occupation: occupation,
    ticket: null
} = req.body; // Get the data from the request body

  console.log('Received data:', rating, price);

});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

}
get();