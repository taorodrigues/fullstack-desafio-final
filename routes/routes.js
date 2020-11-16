import express from 'express';
const transactionRouter = express.Router();
//const TransactionModel = require('../services/transactionService');
//import { TransactionModel } from ('../services/transactionService');
//transactionRouter.get('/:period', TransactionModel.getAll);
// app.get('/:period/:description', transactionRouter.get);
// app.put('/:id', transactionRouter.put);
// app.post('/', transactionRouter.post);
// app.delete('/:id', transactionRouter.delete);

transactionRouter.use((err, req, res, next) => {
  logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
  res.status(400).send({ error: err.message });
});

export default transactionRouter;
