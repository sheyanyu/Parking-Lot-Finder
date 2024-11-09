const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://sylvia:4xs2pp1R6EVSd8k5@parkinglotfinder.jj5d2.mongodb.net/?retryWrites=true&w=majority&appName=ParkingLotFinder";

const client = new MongoClient(uri);

const database = client.db('parkingdb');
const samples = database.collection('parking_lot');

async function run() {

    try {
  
      const query = {weekday : 1};
  
      const sample = await samples.findOne(query);
  
      console.log(sample)
  
    } finally {
  
      // Ensures that the client will close when you finish/error
      await client.close();

    }
  
  }

  async function write() {

    try {

        const generateRandomDocument = () => ({
            _id: Math.floor(Math.random() * 1000) + 1, // Generates a new ObjectId
            weekday: Math.floor(Math.random() * 7) + 1, // Random integer between 1 and 7
            ticket: new Date(2000, 0, 1, 5), // Fixed Date: 2000-01-01T05:00:00.000+00:00
            time: new Date(2000, 0, 1, 5), // Fixed Date: 2000-01-01T05:00:00.000+00:00
            price: Math.floor(Math.random() * 100) + 1, // Random price between 1 and 100
            occupation: Math.floor(Math.random() * 100), // Random occupation percentage between 0 and 100
        });

        // Generate an array of 10 random documents
        const randomDocuments = Array.from({ length: 10 }, generateRandomDocument);

        // Insert the documents into MongoDB
        const result = await samples.insertMany(randomDocuments);
        
        console.log(result); 

    } finally {

        await client.close(); 

    }

}

write().catch(console.dir);