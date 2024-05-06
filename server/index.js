const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const globalError = require('./controllers/errorControllers');
const commentRoutes = require('./routes/commentRoutes');
const appError = require('./utils/appError');
const morgan = require('morgan');
const postRoutes = require('./routes/postRoutes');
dotenv.config();
const DB = process.env.MONGODB_CONNECTION.replace(
  '<password>',
  process.env.PASSWORD
);
const port = process.env.PORT || 4000;
const app = express();
const whitelist = [
  'http://localhost:5173',
  'https://blog-app-1-egng.onrender.com',
  'http://localhost:4173',
];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.get('/', function (req, res) {
  res.send('Successfully connect');
});
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log('Connect to MongoDB'))
  .catch((err) => {
    console.log(err.message);
  });
app.listen(port, () => {
  console.log('Server is running on port ' + port);
});
app.all('*', (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalError);
