const express = require('express');
const app = express();
const port = 3000;

const express = require('express');
const app = express();
const port = 3000;

const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://sylvia:4xs2pp1R6EVSd8k5@parkinglotfinder.jj5d2.mongodb.net/?retryWrites=true&w=majority&appName=ParkingLotFinder";
const client = new MongoClient(uri);
const database = client.db('parkingdb');
const parking_lot = database.collection('parking_lot');
const unvalidated = database.collection('invalid');

<<<<<<< HEAD
console.log(parking_lot.find().toArray())
=======
async function find() {
>>>>>>> aa29009343d74eef02e43274151a8972ae26f7e9


// async function find() {

//     try {
  
<<<<<<< HEAD
//       const query = {weekday:1};
  
//       const dataset = await parking_lot.findOne(query);
//       console.log(dataset)

        
//     } finally {
  
//       // Ensures that the client will close when you finish/error
//       await client.close();
//     }
//   }
 
 
=======
      const query = {weekday:1};
  
      const dataset = await parking_lot.findOne(query);
      console.log(dataset)
      
      // Middleware to parse JSON request bodies
      app.use(express.json());

      // API endpoint to POST data (add to the dataset)
      app.post('/add-item', (req, res) => {
        const newItem = req.body;

        // Add new item to dataset
        dataset.push(newItem);

        // Respond with the updated dataset
        res.status(201).json({
          message: 'Item added successfully',
          data: dataset,
        });
      });

      // API endpoint to GET all items in the dataset
      app.get('/items', (req, res) => {
        res.json(dataset);
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
  find();

>>>>>>> aa29009343d74eef02e43274151a8972ae26f7e9

//       // Middleware to parse JSON request bodies
//       app.use(express.json());

//       // API endpoint to GET all items in the dataset
//       app.get('/items', (req, res) => {
//         res.json(parking_lot.find().toArray());
//       });

<<<<<<< HEAD
//       // Start the server
//       app.listen(port, () => {
//         console.log(`Server is running at http://localhost:${port}`);
//       });
//   async function write({
//     location: [lat,lon],
//     price: price_input,
//     occupation: occupation_input
//   }) {
//     try {
//         // 10 random records generation
//         // const generateRandomDocument = () => ({
//         //     _id: Math.floor(Math.random() * 100) + 1,
//         //     location: [Math.floor(Math.random() * 100) + 1,Math.floor(Math.random() * 100) + 1], // Generates a new ObjectId
//         //     price: Math.floor(Math.random() * 100) + 1, // Random price between 1 and 100
//         //     occupation: Math.floor(Math.random() * 100), // Random occupation percentage between 0 and 100
//         // });
=======
        // // Insert the documents into MongoDB
        // const result = await unvalidated.insertMany(randomDocuments);
        
        const result = await unvalidated.insertOne({
          location: [lat,lon],
          price: price_input,
          occupation: occupation_input
        });
>>>>>>> aa29009343d74eef02e43274151a8972ae26f7e9

//         // // Generate an array of 10 random documents
//         // const randomDocuments = Array.from({ length: 10 }, generateRandomDocument);

//         // // Insert the documents into MongoDB
//         // const result = await unvalidated.insertMany(randomDocuments);
        
//         const result = await unvalidated.insertOne({
//           location: [lat,lon],
//           price: price_input,
//           occupation: occupation_input
//         });

//         console.log(result); 

//     } finally {

//         await client.close(); 

//     }

// }

// // write({
// //   location: [1,1],
// //   price: 2,
// //   occupation: 3
// // }).catch(console.dir);


<<<<<<< HEAD
=======
// write({
//   location: [1,1],
//   price: 2,
//   occupation: 3
// }).catch(console.dir);
>>>>>>> aa29009343d74eef02e43274151a8972ae26f7e9
