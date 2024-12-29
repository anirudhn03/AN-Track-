const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// load environment variables
dotenv.config();

// validate environment variables
if (!process.env.MONGODB_URI) {
  console.error('error: mongodb_uri is not set in environment variables');
  process.exit(1);
}

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// connect to mongodb
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('mongodb connected successfully'))
  .catch((err) => console.error('mongodb connection failed:', err));

// import routes
const expenseroutes = require('./routes/expenseRoutes');
const splitroutes = require('./routes/splitRoutes');
const taskroutes = require('./routes/taskRoutes');

// use routes with /api prefix
app.use('/api/expenses', expenseroutes);
app.use('/api/splits', splitroutes);
app.use('/api/tasks', taskroutes);

// default route for testing server
app.get('/', (req, res) => {
  res.send('server is running...');
});

// handle unknown routes
app.use((req, res) => {
  res.status(404).send({ error: 'not found' });
});

// error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    error: process.env.NODE_ENV === 'development' ? err.message : 'internal server error',
  });
});

// serve react app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
