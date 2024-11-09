import { getData } from "../app";
let data;

// Event listener for user click
document.addEventListener("UserClickedOnList", async (event) => {
  const params = new URLSearchParams(window.location.search);
  const place_id = params.get("id");
  const metadata = await getData(place_id);
  data = {
    time: metadata['time'],
    occupation: metadata['occupation']
  } 
  || 
  // Example data
  {
    time: [
      '2000-01-03T10:00:00.000+00:00', // Monday
      '2000-01-04T10:00:00.000+00:00', // Tuesday
      '2000-01-05T10:00:00.000+00:00', // Wednesday
      '2000-01-06T10:00:00.000+00:00', // Thursday
      '2000-01-07T10:00:00.000+00:00', // Friday
      '2000-01-08T10:00:00.000+00:00', // Saturday
      '2000-01-09T10:00:00.000+00:00', // Sunday
    ],
    occupation: [80, 75, 70, 85, 90, 60, 65]
  };
});

const tf = require('@tensorflow/tfjs-node');
const moment = require('moment');
const { MinMaxScaler } = require('scikitjs');
const scikit = require('scikitjs');
scikit.setBackend(tf);

// Preprocessing
const timesMoment = data.time.map(time => moment(time));
const daysOfWeek = timesMoment.map(time => time.day()); // 0 for Sunday, 6 for Saturday
const hours = timesMoment.map(time => time.hour());
const minutes = timesMoment.map(time => time.minute());

// One-hot encode day of the week
const dayOfWeekEncoded = tf.oneHot(tf.tensor1d(daysOfWeek, 'int32'), 7).arraySync();

// Combine features
let featuresCombined = dayOfWeekEncoded.map((day, i) => [...day, hours[i], minutes[i]]);

// Scale features
const featureScaler = new MinMaxScaler({ featureRange: [0, 1] });
featuresCombined = featureScaler.fitTransform(featuresCombined);

// Scale target
const targetScaler = new MinMaxScaler({ featureRange: [0, 1] });
const targetScaled = targetScaler.fitTransform(data.occupation.map(o => [o]));

// Prepare sequences
const sequenceLength = data.time.length;
const X = [];
const y = [];
for (let i = sequenceLength; i < featuresCombined.length; i++) {
  X.push(featuresCombined.slice(i - sequenceLength, i));
  y.push(targetScaled[i]);
}

const XTensor = tf.tensor3d(X);
const yTensor = tf.tensor2d(y);

// Build model
const model = tf.sequential();
model.add(tf.layers.lstm({ units: 50, returnSequences: true, inputShape: [XTensor.shape[1], XTensor.shape[2]] }));
model.add(tf.layers.lstm({ units: 50, returnSequences: false }));
model.add(tf.layers.dense({ units: 25 }));
model.add(tf.layers.dense({ units: 1 }));

model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

// Train model
(async () => {
  await model.fit(XTensor, yTensor, { batchSize: 1, epochs: 10 });

  // Prediction function for the current weekday occupation (full 24-hour period)
  const predictRealTimeWeekdayOccupation = async () => {
    const now = moment();
    const weekdayNumber = now.day(); // Get the current weekday (0-6)

    const predictedOccupations = [];

    for (let hour = 0; hour < 24; hour++) {
      const minute = 0; // Predict at the start of each hour

      // One-hot encode the current weekday
      const dayEncoded = tf.oneHot(tf.tensor1d([weekdayNumber], 'int32'), 7).arraySync()[0];
      
      // Scale hour and minute features
      const timeFeaturesScaled = featureScaler.transform([[hour, minute]])[0];

      // Combine day and time features
      const featuresCombined = [...dayEncoded, ...timeFeaturesScaled];
      
      // Create a sequence for prediction
      const sequence = Array(sequenceLength).fill(featuresCombined);

      // Convert to tensor for prediction
      const sequenceTensor = tf.tensor3d([sequence]);

      // Predict the occupation
      const predictedOccupationScaled = model.predict(sequenceTensor);
      const predictedOccupation = targetScaler.inverseTransform(predictedOccupationScaled.arraySync());

      predictedOccupations.push(predictedOccupation[0][0]);
    }

    console.log('Predicted Occupations for Each Hour Today:', predictedOccupations);
  };

  // Predict the occupation for the current weekday
  await predictRealTimeWeekdayOccupation();
})();
