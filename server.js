require('dotenv').config();
const connectDB = require('./config/dbConn');
const express = require('express');
const cors = require('cors');
const statesRoutes = require('./routes/states');

const app = express();
const PORT = process.env.PORT || 3500;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.use('/states', statesRoutes);

app.all('/*splat', (req, res) => {
  res.status(404);

  if (req.accepts('html')) {
    res.sendFile(__dirname + '/views/404.html');
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});