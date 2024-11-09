import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler, OneHotEncoder
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
import datetime

# Example data
data = {
    'time': [
        '2000-01-03T10:00:00.000+00:00',  # Monday
        '2000-01-04T10:00:00.000+00:00',  # Tuesday
        '2000-01-05T10:00:00.000+00:00',  # Wednesday
        '2000-01-06T10:00:00.000+00:00',  # Thursday
        '2000-01-07T10:00:00.000+00:00',  # Friday
        '2000-01-08T10:00:00.000+00:00',  # Saturday
        '2000-01-09T10:00:00.000+00:00',  # Sunday
    ],
    'occupation': [80, 75, 70, 85, 90, 60, 65]
}

df = pd.DataFrame(data)

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

sequence_length = len(data)
X, y = [], []
for i in range(sequence_length, len(features_combined)):
    X.append(features_combined[i-sequence_length:i])
    y.append(target_scaled[i])

X, y = np.array(X), np.array(y)

model = Sequential()
model.add(LSTM(50, return_sequences=True, input_shape=(X.shape[1], X.shape[2])))
model.add(LSTM(50, return_sequences=False))
model.add(Dense(25))
model.add(Dense(1))

model.compile(optimizer='adam', loss='mean_squared_error')

model.fit(X, y, batch_size=1, epochs=10)

def predict():
    now = datetime.datetime.now()
    weekday_number = now.weekday()
    current_hour = now.hour
    current_minute = now.minute

    new_day = np.array([[weekday_number]])
    new_day_encoded = encoder.transform(new_day)

    new_time_features = feature_scaler.transform([[current_hour, current_minute]])

    new_features_combined = np.concatenate([new_day_encoded, new_time_features], axis=1)

    new_sequence = np.tile(new_features_combined, (sequence_length, 1))

    new_sequence = new_sequence.reshape(1, sequence_length, new_features_combined.shape[1])

    predicted_occupation_scaled = model.predict(new_sequence)

    predicted_occupation = target_scaler.inverse_transform(predicted_occupation_scaled)

    print("Predicted Occupation:", predicted_occupation[0][0])


predict()
