import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import routes from './routes/routes';
import path from 'path';
import dotenv from 'dotenv';
import winston from 'winston';
const __dirname = path.dirname(new URL(import.meta.url).pathname);

/**
 * Faz a leitura do arquivo
 * ".env" por padrão
 */
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/**
 * Vinculando o React ao app
 */
app.use(express.static(path.join(__dirname, 'client/build')));

/**
 * Rota raiz
 */
app.get('/api/', (_, response) => {
  response.send({
    message:
      'Welcome to transaction API. You can access /transaction and follow the instructions.',
  });
});

/**
 * Rotas principais do app
 */
app.use('/api/transaction', routes);

/**
 * Conexão ao Banco de Dados
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
   * Definição de porta e
   * inicialização do app
   */
  const APP_PORT = process.env.PORT || 3001;
  app.listen(APP_PORT, () => {
    console.log(`The Server was iniciated at PORT ${APP_PORT}`);
  });
});
