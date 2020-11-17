import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

// Aqui havia um erro difícil de pegar. Importei como "transactionModel",
// com "t" minúsculo. No Windows, isso não faz diferença. Mas como no Heroku
// o servidor é Linux, isso faz diferença. Gastei umas boas horas tentando
// descobrir esse erro :-/
import TransactionModel from '../models/TransactionModel';

export const getByPeriod = async (req, res, next) => {
  const period = req.query.period;
  const description = req.query.description;
  let transactions = [];

  console.log(period);
  console.log(description);

  if (!period) {
    throw new Error('Period must be informed in the URL');
  }

  let periodSplit = period.split('-');

  const yearQuery = parseInt(periodSplit[0]);
  const monthQuery = parseInt(periodSplit[1]);
  const daysInMonth = getDaysInMonth(monthQuery, yearQuery);

  try {
    if (description) {
      console.log('Buscando com description');
      transactions = await TransactionModel.find({
        year: {
          $eq: yearQuery,
        },
        month: {
          $eq: monthQuery,
        },
        day: {
          $gte: 1,
          $lt: daysInMonth,
        },
        description: { $regex: description, $options: 'i' },
      });
    } else {
      transactions = await TransactionModel.find({
        year: {
          $eq: yearQuery,
        },
        month: {
          $eq: monthQuery,
        },
        day: {
          $gte: 1,
          $lt: daysInMonth,
        },
      });
    }

    console.log(transactions.length);

    logger.info(
      `GET /transaction/period ${JSON.stringify(transactions, null, 2)}`
    );
    res.send({
      length: transactions.length,
      transactions: [...transactions],
    });
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const id = req.params.id;

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
    const id = req.params.id;
    console.log(id);

    const transaction = await TransactionModel.findOneAndDelete({ _id: id });
    logger.info(
      `DELETE /transaction/id=${id} ${JSON.stringify(transaction, null, 2)}`
    );
    res.send(`The transaction with id ${id} was deleted.`);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res) => {
  const transaction = new TransactionModel(req.body);
  console.log('Create Body' + req.body);

  try {
    await TransactionModel.create(transaction);
    logger.info(`POST /transaction - ${JSON.stringify(transaction)}`);
    res.send(transaction);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Algum erro ocorreu ao salvar' });
    logger.error(`POST /transaction - ${JSON.stringify(error.message)}`);
  }
};

var getDaysInMonth = function (month, year) {
  // Here January is 1 based
  //Day 0 is the last day in the previous month
  return new Date(year, month, 0).getDate();
  // Here January is 0 based
  // return new Date(year, month+1, 0).getDate();
};
