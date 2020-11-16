import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

// Aqui havia um erro difícil de pegar. Importei como "transactionModel",
// com "t" minúsculo. No Windows, isso não faz diferença. Mas como no Heroku
// o servidor é Linux, isso faz diferença. Gastei umas boas horas tentando
// descobrir esse erro :-/
import { TransactionModel } from ('../models/TransactionModel');

// export const getAll = async (req, res, next) => {
//   try {
//     console.log(req.params.period);

//     const transactions = await TransactionModel.find({});

//     logger.info(`GET /transactions ${JSON.stringify(transactions, null, 2)}`);
//     res.send(transactions);
//   } catch (err) {
//     next(err);
//   }
// };
