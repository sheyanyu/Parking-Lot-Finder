import * as tf from '@tensorflow/tfjs';
// Define the LSTM model


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
  