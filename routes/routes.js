import * as controller from '../services/transactionService';
import express from 'express';

const transactionRouter = express.Router();
s;

transactionRouter.get('/getById/:id', controller.getById);
transactionRouter.get('/', controller.get);
transactionRouter.post('/', controller.create);
transactionRouter.put('/:id', controller.update);
transactionRouter.delete('/:id', controller.removeTransaction);

transactionRouter.use((err, req, res, next) => {
  logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
  res.status(500).send({ error: err.message });
  next(err);
});

export default transactionRouter;
