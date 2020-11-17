import * as controller from '../services/transactionService';
import express from 'express';
const router = express.Router();

router.get('/', controller.getByPeriod);
//router.get('/getById/:id?', controller.getById);
router.delete('/:id', controller.removeTransaction);
router.post('/', controller.create);
// app.get('/:period/:description', transactionRouter.get);
// app.put('/:id', transactionRouter.put);

router.use((err, req, res, next) => {
  logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
  res.status(400).send({ error: err.message });
});

export default router;
