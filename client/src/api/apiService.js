import axios from 'axios';

const api = axios.create({ baseURL: 'api' });
const RESOURCE = '/transaction';

const CURRENT_YEAR = new Date().getFullYear();
const GLOBAL_YEARS = [CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1];
const GLOBAL_MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const MONTH_DESCRIPTIONS = [
  '',
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

let allPeriods = [];

function _processPeriods() {
  allPeriods = [];
  let index = 0;

  GLOBAL_YEARS.forEach((year) => {
    GLOBAL_MONTHS.forEach((month) => {
      const id = `${year}-${month.toString().padStart(2, '0')}`;
      const monthDescription = `${MONTH_DESCRIPTIONS[month]}/${year}`;

      allPeriods.push({ id, description: monthDescription, index: index++ });
    });
  });
}

function _prepareTransaction(transaction) {
  const { description, category, _id: id, month, ...otherFields } = transaction;

  return {
    id,
    description,
    category,
    month,
    descriptionLowerCase: description.toLowerCase(),
    categoryLowerCase: category.toLowerCase(),
    monthDescription: MONTH_DESCRIPTIONS[month],
    ...otherFields,
  };
}

async function getTransactionsFrom(period) {
  const { id: yearMonth } = period;
  const { data } = await api.get(`${RESOURCE}?period=${yearMonth}`);

  const frontEndTransactions = data.transactions.map((transaction) => {
    return _prepareTransaction(transaction);
  });

  return frontEndTransactions.sort((a, b) =>
    a.yearMonthDay.localeCompare(b.yearMonthDay)
  );
}

async function getAllPeriods() {
  if (allPeriods.length === 0) {
    _processPeriods();
  }

  return allPeriods;
}

async function deleteTransaction(id) {
  await api.delete(`${RESOURCE}/${id}`);
  return;
}

function getCompleteTransaction(transaction) {
  const { yearMonthDay } = transaction;
  const year = +yearMonthDay.substring(0, 4);
  const month = +yearMonthDay.substring(5, 7);
  const day = +yearMonthDay.substring(8, 10);

  const completeTransaction = {
    ...transaction,
    year,
    month,
    day,
  };

  return completeTransaction;
}

async function updateTransaction(transaction) {
  const { id } = transaction;
  const completeTransaction = getCompleteTransaction(transaction);
  await api.put(`${RESOURCE}/${id}`, completeTransaction);

  const updatedTransaction = _prepareTransaction(completeTransaction);
  return updatedTransaction;
}

async function postTransaction(transaction) {
  const completeTransaction = getCompleteTransaction(transaction);
  const { data } = await api.post(RESOURCE, completeTransaction);

  const newTransaction = _prepareTransaction(data.transaction);
  return newTransaction;
}

export {
  getTransactionsFrom,
  getAllPeriods,
  deleteTransaction,
  postTransaction,
  updateTransaction,
};
