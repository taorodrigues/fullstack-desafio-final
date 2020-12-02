import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import routes from './routes/routes';
import path from 'path';
import dotenv from 'dotenv';
import winston from 'winston';
const __dirname = path.dirname(new URL(import.meta.url).pathname);

/**
 * Read the file ".env" by default
 */
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/**
 * Connect the api to the React App
 */
app.use(express.static(path.join(__dirname, 'client/build')));

/**
 * Root route
 */
app.get('/api/', (_, response) => {
  response.send({
    message:
      'Welcome to transaction API. You can access /transaction and follow the instructions.',
  });
});

/**
 * Main routes
 */
app.use('/api/transaction', routes);

/**
 * Database connection
 */
const { DB_CONNECTION } = process.env;

mongoose.connect(
  DB_CONNECTION,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      //connectedToMongoDB = false;
      console.error(`Error when trying to connect to MongoDB - ${err}`);
    }
  }
);

const { connection } = mongoose;

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

global.logger = winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'transaction-api.log' }),
  ],
  format: combine(label({ label: 'transaction-api' }), timestamp(), myFormat),
});

connection.once('open', () => {
  //connectedToMongoDB = true;
  console.log('Connected to MongoDB');

  /**
   * Declaring PORT and starting the app
   */
  const APP_PORT = process.env.PORT || 3001;
  app.listen(APP_PORT, () => {
    console.log(`The Server was iniciated at PORT ${APP_PORT}`);
  });
});
