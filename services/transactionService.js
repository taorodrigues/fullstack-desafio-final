import TransactionModel from '../models/TransactionModel';
import dateHelpers from '../helpers/dateHelpers';

export const get = async (req, res, next) => {
  const period = req.query.period;
  const description = req.query.description;
  let transactions = [];

  if (!period) {
    throw new Error('Period must be informed in the URL');
  }

  try {
    if (description) {
      transactions = await TransactionModel.find({
        yearMonth: {
          $eq: period,
        },
        description: { $regex: description, $options: 'i' },
      });
    } else {
      transactions = await TransactionModel.find({
        yearMonth: {
          $eq: period,
        },
      });
    }

    console.log(transactions.length);

    let expenses = 0;
    let incomes = 0;
    for (const item of transactions) {
      if (item.type === '+') {
        incomes += item.value;
      } else {
        expenses += item.value;
      }
    }
    const totalValue = incomes - expenses;

    logger.info(
      `GET /transaction/period ${JSON.stringify(transactions, null, 2)}`
    );

    res.send({
      total: transactions.length,
      incomes: incomes,
      expenses: expenses,
      saldo: totalValue,
      transactions: [...transactions],
    });
  } catch (err) {
    next(err);
  }
};

export const getById = async (request, res, next) => {
  try {
    await validateTransactionId(request.params);
    const id = request.params.id;

    const transaction = await TransactionModel.find({ _id: id });
    logger.info(
      `GET /transaction/id=${id} ${JSON.stringify(transaction, null, 2)}`
    );
    res.send(transaction);
  } catch (err) {
    next(err);
  }
};

export const removeTransaction = async (req, res, next) => {
  try {
    await validateTransactionId(req.params);
    const id = req.params.id;

    const transaction = await TransactionModel.findOneAndDelete({ _id: id });
    logger.info(
      `DELETE /transaction/id=${id} ${JSON.stringify(transaction, null, 2)}`
    );
    res.send({
      status: 'ok',
      message: `The transaction with id ${id} was deleted.`,
    });
  } catch (err) {
    next(err);
  }
};

export const create = async (request, response, next) => {
  try {
    await validateTransactionData(request.body);
    const transaction = new TransactionModel(request.body);

    await TransactionModel.create(transaction);

    logger.info(`POST /transaction - ${JSON.stringify(transaction)}`);

    response.send({ status: 'ok', transaction: transaction });
  } catch (error) {
    next(error);
  }
};

export const update = async (request, response, next) => {
  const { body, params } = request;

  try {
    await validateTransactionId(params);
    await validateTransactionData(body);

    const { description, value, category, year, month, day, type } = body;
    const { id } = params;

    const period = dateHelpers.createPeriodFrom(year, month);

    const transaction = {
      description,
      value,
      category,
      year,
      month,
      day,
      yearMonth: period,
      yearMonthDay: dateHelpers.createDateFrom(year, month, day),
      type,
    };

    const transactionUpdated = await TransactionModel.findOneAndUpdate(
      { _id: id },
      transaction,
      {
        new: true, //this parameter makes the query return the updated object
      }
    );

    logger.info(
      `PUT /transaction/id=${id} - ${JSON.stringify(transactionUpdated)}`
    );

    response.send({ transaction: transactionUpdated });
  } catch (error) {
    next(error);
  }
};

async function validateTransactionId(params) {
  if (!params.id) {
    throw new Error('The id must be informed');
  }
}

async function validateTransactionData(body) {
  const { description, value, category, year, month, day, type } = body;

  if (!description || description.trim() === '') {
    throw new Error('description is mandatory');
  }

  if (!value || value < 0) {
    throw new Error('value is mandatory');
  }

  if (!category || category.trim() === '') {
    throw new Error('category is mandatory');
  }

  if (!year || year.toString() === '') {
    throw new Error(`year is mandatory`);
  }

  if (!month || month.toString() === '') {
    throw new Error(`month is mandatory`);
  }

  if (!day || day.toString() === '') {
    throw new Error(`day is mandatory`);
  }

  if (!type || type.toString() === '') {
    throw new Error(
      `type is mandatory (can be '+' for income or '-' for outcome)`
    );
  }

  if (value < 0) {
    throw new Error('value must be a number bigger or equal to 0');
  }

  const period = dateHelpers.createPeriodFrom(year, month);
  dateHelpers.validatePeriod(period);
  dateHelpers.validateDay(day, month, year);

  if (type.trim() !== '+' && type.trim() !== '-') {
    throw new Error(`Invalid type (${type}) - must have the value '+' or '-'`);
  }
}
