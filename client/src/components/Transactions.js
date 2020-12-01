import React from 'react';
import Transaction from './Transaction';

export default function Transactions({
  transactions,
  onDeleteTransaction,
  onEditTransaction,
}) {
  const handleDelete = (id) => {
    onDeleteTransaction(id);
  };

  const handleEdit = (id) => {
    onEditTransaction(id);
  };

  let currentDay = 1;

  return (
    <div className='center' style={styles.transactionsStyle}>
      {transactions.map((transaction) => {
        const { id, day } = transaction;

        let differentDay = false;
        if (day !== currentDay) {
          differentDay = true;
          currentDay = day;
        }

        return (
          <Transaction
            key={id}
            transaction={transaction}
            onDelete={handleDelete}
            onEdit={handleEdit}
            differentDay={differentDay}
          />
        );
      })}
    </div>
  );
}

const styles = {
  transactionsStyle: {
    padding: '5px',
  },
};
