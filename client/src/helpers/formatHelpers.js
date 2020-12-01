const moneyFormat = Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

function formatMoney(value) {
  return moneyFormat.format(value);
}

export { formatMoney };
