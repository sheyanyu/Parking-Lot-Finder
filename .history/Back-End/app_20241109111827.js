
// middleware to parse JSON bodies
app.use(express.json()); // for parsing application/json

// POST route to handle form data sent via AJAX
app.post('/items', (req, res) => {
  const  formData = {
    rating: ratingValue,
    price: price,
    occupation: occupation,
    ticket: time
} = req.body; // Get the data from the request body

  console.log('Received data:', rating, price);

});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
