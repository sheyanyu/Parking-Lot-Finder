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


    // Start the server
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });

    // Route to get data from MongoDB using location (id)
    app.get('/items', async (req, res) => {
        const { id } = req.query; 
    
        if (!id) {
            return res.status(400).json({ message: "ID parameter is required" });
        }

        try {
            const data = await get_awaiting_Data(id); // Fetch data by location
            res.json(data); // Return the data as JSON response
            console.log(data);
        } catch (error) {
            res.status(500).send("Error fetching data");
        }
    });

  // Function to fetch data from the parking_lot collection by location ID
    async function get_valid_Data(id) {
        
      try {
        
          // Query the parking_lot collection using the location (or _id) filter
          const data = await parking_lot.find({ location_id: id }).toArray();
          return data;
        } catch (error) {
          console.error('Error fetching data:', error);
          throw error;
        }
    }
    async function get_awaiting_Data(id) {
        try {
            // Query the parking_lot collection using the location (or _id) filter
            const data = await unvalidated.find({ location_id: id }).toArray();
            return data;
          } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
          }
      }

    // POST route to handle form data
    app.post('/submit', async (req, res) => {
    // Destructure data from the request body
    const { location_id,
            time,
            rating,
            price,
            occupation,
            ticket,
            ticketTime
        } = req.body;

  // Log received data
  console.log('Received data:', location_id, rating, price, occupation, ticket, ticketTime);
  
  try {
    const result = {
        'location_id': "ChIJW4qs73XS5okRwAauJFY7j1E",
        'time': time,
        'rating': Number(rating),
        'price': Number(price),
        'occupation': Number(occupation),
        'ticket': ticket
    }
    await unvalidated.insertOne(result);
    
    const invalid_inputs = get_awaiting_Data(location_id);
    const valid_location = get_valid_Data("ChIJW4qs73XS5okRwAauJFY7j1E");
    console.log(result)
    if (invalid_inputs.length>=5 || //case: invalid count>5

        //case: valid inputs
        (result['location_id']==valid_location['location_id']
         && result['price']==valid_location['price'])){

        // update valid input
        console.log(typeof valid_location['time'])
        valid_location['time'].push(time);
        valid_location['rating'].push(Number(rating));
        valid_location['price'].push(Number(price));
        valid_location['occupation'].push(Number(occupation));
        valid_location['ticket'].push(ticket);
        
    }
    
        
    // Send success response
    res.status(201).json({ message: "Data submitted successfully", insertedId: result.insertedId });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ message: "Error submitting data" });
  }
});


module.exports = {
    get_valid_Data,
    get_awaiting_Data
};
