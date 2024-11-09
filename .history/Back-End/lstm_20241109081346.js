
const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://sylvia:4xs2pp1R6EVSd8k5@parkinglotfinder.jj5d2.mongodb.net/?retryWrites=true&w=majority&appName=ParkingLotFinder";

const client = new MongoClient(uri);

const database = client.db('parkingdb');
const parking_lot = database.collection('parking_lot');
const unvalidated = database.collection('invalid');
// Prepare data for the LSTM (sequence format)
const timesteps = 10; // Number of time steps for each input sequence
const numFeatures = 4; // Number of features per timestep (4 in this case)

const createSequences = (data, target, timesteps) => {
  const X = [];
  const y = [];

  for (let i = timesteps; i < data.length; i++) {
    const seq = data.slice(i - timesteps, i);
    const label = target[i]; // The label for this sequence
    X.push(seq);
    y.push(label);
  }

  return [tf.tensor(X), tf.tensor(y)];
};

// Normalize or scale the numeric features (optional but recommended)
const normalize = (arr) => {
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    return arr.map(val => (val - min) / (max - min));
  };
  
  // Extract features and labels
  const features = rawData.map(item => [
    item.weekday, 
    item.ticket, // Consider normalizing ticket time if necessary
    item.time,   // Same for time
    item.price
  ]);
  
  const labels = rawData.map(item => item.occupation); // Target: occupation
  
  // Normalize the features (you could also scale ticket and time)
  const normalizedFeatures = features.map(f => normalize(f));

// Create sequences
const [X_train, Y_train] = createSequences(normalizedFeatures, labels, timesteps);

// Define and compile the model (same as before)
const model = tf.sequential();
model.add(tf.layers.lstm({
  units: 50,
  inputShape: [timesteps, numFeatures],
  returnSequences: true
}));
model.add(tf.layers.lstm({
  units: 50,
  returnSequences: false
}));
model.add(tf.layers.dense({
  units: 1,   // Output: occupation (binary classification, 0 or 1)
  activation: 'sigmoid'
}));

model.compile({
  optimizer: 'adam',
  loss: 'binaryCrossentropy',
  metrics: ['accuracy']
});

// Train the model
async function trainModel() {
  await model.fit(X_train, Y_train, {
    epochs: 50,
    batchSize: 32,
    validationSplit: 0.2,
    shuffle: true
  });
  console.log('Model training complete');
}

trainModel();


async function predictNext24Hours(lastSequence) {
    let predictions = [];
  
    let currentSequence = lastSequence; // This is your most recent sequence of features (e.g., the last 10 hours of data)
  
    for (let i = 0; i < 24; i++) {
      // Predict the next time step (occupation for the next hour)
      const prediction = model.predict(tf.tensor([currentSequence])).dataSync()[0];
  
      // Append the prediction to the predictions array
      predictions.push(prediction);
  
      // Update the current sequence for the next prediction
      // This can be done by shifting the sequence and adding the predicted value as the new input for the sequence
      // Assuming the occupation is the last value in the sequence:
      currentSequence = [...currentSequence.slice(1), prediction];
    }
  
    return predictions;
  }
  
  // Example usage:
  const lastSequence = normalizedFeatures[normalizedFeatures.length - 1]; // Last sequence in your training data
  predictNext24Hours(lastSequence).then(predictions => {
    console.log('Predicted occupation for next 24 hours:', predictions);
  });
  