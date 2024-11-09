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



// Prepare data for the LSTM (sequence format)
const timesteps = 10; // Number of time steps for each input sequence
const numFeatures = features[0].length; // Number of features per timestep (4 in this case)

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

// Create sequences
const [X_train, Y_train] = createSequences(normalizedFeatures, labels, timesteps);

// Assuming X_train and Y_train are your training data (already prepared as sequences)

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


