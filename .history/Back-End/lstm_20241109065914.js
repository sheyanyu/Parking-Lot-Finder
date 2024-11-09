import * as tf from '@tensorflow/tfjs';
// Define the LSTM model
const model = tf.sequential();

// Add an LSTM layer with 50 units and return sequences (to pass to another layer)
model.add(tf.layers.lstm({
  units: 50,
  inputShape: [timesteps, features], // timesteps: number of time steps, features: number of features per timestep
  returnSequences: true // return the full sequence for further layers
}));

// Add a second LSTM layer
model.add(tf.layers.lstm({
  units: 50,
  returnSequences: false
}));

// Add a Dense layer to output the prediction
model.add(tf.layers.dense({ units: 1 })); // For regression; for classification, adjust the units as needed

// Compile the model with an optimizer and loss function
model.compile({
  optimizer: 'adam',
  loss: 'meanSquaredError' // Use appropriate loss function depending on the task (e.g., 'categoricalCrossentropy' for classification)
});

async function trainModel() {
    await model.fit(X_train, Y_train, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2, // 20% of the data will be used for validation
      shuffle: true
    });
    console.log('Model training complete');
  }
  
  trainModel();

  const X_new = tf.randomNormal([1, timesteps, features]); // New input sequence
const predictions = model.predict(X_new);
predictions.print(); // Display the predicted output