const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./Config/db');
const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require('./middleware/errorhandling');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/orders', orderRoutes); // Use the order routes
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
