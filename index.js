const express = require('express');
const path = require('path'); // Include the path module
const app = express();
const { exec } = require('child_process');
const port = 5000;

app.use(express.static('public'));

// Serve the index page for all other requests
app.get("/", (req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    res.sendFile(indexPath);
  });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
