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
            const data = await get_valid_Data(id); // Fetch data by location
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
        try {
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
            console.log('Received data:', location_id, time, rating, price, occupation, ticket, ticketTime);
            const result = {
                'location_id': "ChIJW4qs73XS5okRwAauJFY7j1E",
                'time': time,
                'rating': Number(rating),
                'price': Number(price),
                'occupation': Number(occupation),
                'ticket': ticket
            }
          await unvalidated.insertOne(result);

          let count = 0
          const invalid = await get_awaiting_Data("ChIJW4qs73XS5okRwAauJFY7j1E");
          // console.log("Invalid", invalid)
          for (let i in invalid){
            console.log("invalid obj", invalid[i])
              if (Number(invalid[i]['price'])===Number(price)){
                  count+=1
              }
          };
    
    const valid_location = await get_valid_Data("ChIJW4qs73XS5okRwAauJFY7j1E");
    
    console.log("count", count)
    // console.log("valid", valid_location[0]["location_id"])
    // console.log("invalid first", invalid[0]['location_id'])
    if (count>=5 ){
        const aaa = await parking_lot.updateOne(
            { location_id: "ChIJW4qs73XS5okRwAauJFY7j1E" },
            { $set: { price: Number(price) } }
        );
        
    }else if (location_id===valid_location[0]["location_id"]
         && price ===valid_location[0]['price']){
          console.log("reached")
        // update valid input
        await parking_lot.updateOne(
            { location_id: location_id },
            {
                $push: {
                    time: time,
                    rating: Number(rating),
                    price: Number(price),
                    occupation: Number(occupation),
                    ticket: ticket
                }
            }
        );
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