// import { getData } from "../app";
import { exec } from "child_process"; 
let data;
const params = new URLSearchParams(window.location.search);
const place_id = params.get("id");
// Middleware to parse JSON bodies
app.use(express.json()); // for parsing application/json
app.use(cors());
document.addEventListener('event02', async () => {
    console.log('event02 is listened');
    try {
        // Fetch data from the backend
        const response = await fetch(`http://localhost:3000/items?id=${place_id}`, {
          method: 'GET',
          headers: {
              "Content-Type": "application/json"
          }
      });
        
          if (response.ok) {
          const parkingLots = await response.json();
          console.log("Fetched Parking Lots:", parkingLots);
          data = {
            'time': parkingLots['time'],
            'occupation': parkingLots['occupation']
            }
          } else {
          console.error("Failed to fetch parking lots:", response.statusText);
          }
      } catch (error) {
          console.error("Error fetching parking lot data:", error);
          data = {
            'time': [
                '2000-01-03T10:00:00.000+00:00',
                '2000-01-04T10:00:00.000+00:00',
                '2000-01-05T10:00:00.000+00:00',
                '2000-01-06T10:00:00.000+00:00',
                '2000-01-07T10:00:00.000+00:00',
                '2000-01-08T10:00:00.000+00:00',
                '2000-01-09T10:00:00.000+00:00',
            ],
            'occupation': [80, 75, 70, 85, 90, 60, 65]
        };
        }

    // Write the fetched or example data to a JSON file
    const jsonData = JSON.stringify(data, null, 4);
    const fs = require('fs');

    fs.writeFile('data.json', jsonData, (err) => {
        if (err) {
            console.error('Error writing file', err);
            return;
        }
        console.log('Data file has been saved successfully.');

        exec("python3 occupation_ml.py", (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Python script: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Python script error: ${stderr}`);
                return;
            }
            console.log(stdout);
            
            // Emit a custom event once the predictions are calculated
            const predictionEvent = new Event('predictionsReady');
            document.dispatchEvent(predictionEvent);
        });
    });
});