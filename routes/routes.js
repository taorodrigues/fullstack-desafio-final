import * as controller from '../services/transactionService';
import express from 'express';
import dateHelpers from '../helpers/dateHelpers';
const transactionRouter = express.Router();

transactionRouter.get('/', controller.get);
//router.get('/getById/:id?', controller.getById);
transactionRouter.delete('/:id', controller.removeTransaction);
transactionRouter.post('/', controller.create);
// app.put('/:id', transactionRouter.put);

async function validateTransactionId(params) {
  if (!params.id) {
    throw new Error('É necessário informar o id do lançamento');
  }
}

async function validateTransactionData(body) {
  const { description, value, category, year, month, day, type } = body;

  if (!description || description.trim() === '') {
    throw new Error('A descrição é obrigatória');
  }

  if (!value || value < 0) {
    throw new Error('O valor é obrigatório.');
  }

  if (!category || category.trim() === '') {
    throw new Error('A categoria é obrigatória.');
  }

  if (!year || year.toString() === '') {
    throw new Error(`O ano é obrigatório.`);
  }

  if (!month || month.toString() === '') {
    throw new Error(`O mês é obrigatório.`);
  }

  if (!day || day.toString() === '') {
    throw new Error(`O dia é obrigatório.`);
  }

  if (!type || type.toString() === '') {
    throw new Error(`O tipo de lançamento é obrigatório.`);
  }

  if (value < 0) {
    throw new Error('O valor deve ser maior ou igual a 0.');
  }

  const period = dateHelpers.createPeriodFrom(year, month);
  dateHelpers.validatePeriod(period);
  dateHelpers.validateDay(day, month, year);

  if (type.trim() !== '+' && type.trim() !== '-') {
    throw new Error(
      `Tipo de lançamento inválido (${type}) - A propriedade 'type' deve ter o valor '+' ou '-'`
    );
  }
}

transactionRouter.use((err, req, res, next) => {
  logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
  res.status(400).send({ error: err.message });
});

export default transactionRouter;
