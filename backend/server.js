const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const UserRouter = require('./routes/UserRouter');
const AuthController = require('./controllers/auth/AuthController');
const ImagesController = require('./controllers/Images/ImagesController');
const cors = require('cors');

require('dotenv').config();

app.use(cors());
app.use('/api/User', UserRouter);
app.use('/api/auth', AuthController);
app.use('/api/images', ImagesController);

app.listen(port, () => console.log(`Listening on port ${port}`));
