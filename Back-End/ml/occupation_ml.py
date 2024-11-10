import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler, OneHotEncoder
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
import datetime
import json

# Load the JSON file
with open('data.json', 'r') as f:
    data = json.load(f)

time_data = data['time']
occupation_data = data['occupation']

# Prepare data
df = pd.DataFrame({'time': time_data, 'occupation': occupation_data})
df['time'] = pd.to_datetime(df['time'])
df['day_of_week'] = df['time'].dt.dayofweek  # 0 for Monday, 6 for Sunday
df['hour'] = df['time'].dt.hour
df['minute'] = df['time'].dt.minute

encoder = OneHotEncoder(sparse_output=False)
day_of_week_encoded = encoder.fit_transform(df[['day_of_week']])

time_features = df[['hour', 'minute']].values
features_combined = np.concatenate([day_of_week_encoded, time_features], axis=1)

feature_scaler = MinMaxScaler(feature_range=(0, 1))
features_combined[:, -2:] = feature_scaler.fit_transform(features_combined[:, -2:])

target = df['occupation'].values

target_scaler = MinMaxScaler(feature_range=(0, 1))
target_scaled = target_scaler.fit_transform(target.reshape(-1, 1))

sequence_length = len(time_data)
X, y = [], []
for i in range(sequence_length, len(features_combined)):
    X.append(features_combined[i-sequence_length:i])
    y.append(target_scaled[i])

X, y = np.array(X), np.array(y)

# Define and train the model
model = Sequential()
model.add(LSTM(50, return_sequences=True, input_shape=(X.shape[1], X.shape[2])))
model.add(LSTM(50, return_sequences=False))
model.add(Dense(25))
model.add(Dense(1))

model.compile(optimizer='adam', loss='mean_squared_error')
model.fit(X, y, batch_size=1, epochs=10)

# Function to predict occupation for each hour of the current day
def predict_for_day():
    now = datetime.datetime.now()
    weekday_number = now.weekday()

    predictions = []

    for hour in range(24):
        # Prepare input for each hour
        new_day = np.array([[weekday_number]])
        new_day_encoded = encoder.transform(new_day)

        new_time_features = feature_scaler.transform([[hour, 0]])  # Set minute to 0 for hourly prediction

        new_features_combined = np.concatenate([new_day_encoded, new_time_features], axis=1)
        new_sequence = np.tile(new_features_combined, (sequence_length, 1))
        new_sequence = new_sequence.reshape(1, sequence_length, new_features_combined.shape[1])

        # Predict occupation
        predicted_occupation_scaled = model.predict(new_sequence)
        predicted_occupation = target_scaler.inverse_transform(predicted_occupation_scaled)

        predictions.append(predicted_occupation[0][0])

    return predictions

# Get predictions for the day
predictions = predict_for_day()

# Save predictions to a .js file
output_data = {
    "predictions": predictions
}

with open('', 'w') as f:
    f.write('const predictions = ' + json.dumps(output_data, indent=4) + ';\n')
    f.write('module.exports = predictions;\n')

print("Predictions have been saved to predictions.js")
