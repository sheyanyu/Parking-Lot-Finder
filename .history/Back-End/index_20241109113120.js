const { ready } = require('@tensorflow/tfjs-core');
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
async function replace(query) {
    if ready to replace():
        parkingfind(location)

}