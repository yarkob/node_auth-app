'use strict';

require('dotenv/config');

const express = require('express');
const { authRouter } = require('./routes/auth.route');
const cors = require('cors');
const { userRouter } = require('./routes/user.route');
const { errorMiddleware } = require('./middlewares/error.middleware');

const PORT = process.env.PORT || 3005;

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_HOST,
    credentials: true,
  }),
);

app.use(authRouter);
app.use('/users', userRouter);

app.get('/', (req, res) => {
  res.send('hello world!');
});

app.use(errorMiddleware);

app.listen(PORT, () => {});
