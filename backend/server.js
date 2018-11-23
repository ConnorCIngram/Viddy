const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 5000;
const UserRouter = require('./routes/UserRouter');
const cors = require('cors');

app.use(cors());
app.use('/api/User', UserRouter);

app.listen(port, () => console.log(`Listening on port ${port}`));