const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 5000;
const UserRouter = require('./routes/UserRouter');
const AuthController = require('./controllers/Auth/AuthController');
const cors = require('cors');

app.use(cors());
app.use('/api/User', UserRouter);
app.use('/api/auth', AuthController);

app.listen(port, () => console.log(`Listening on port ${port}`));
console.log("authTokenKey: ", process.env.authTokenKey);