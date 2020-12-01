import React, { useEffect } from 'react';
import Modal from 'react-modal';
import { useState } from 'react';

const EARNING_COLOR = '#27ae60';
const EXPENSE_COLOR = '#c0392b';

Modal.setAppElement('#root');

function today() {
  const date = new Date();

  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  const today = `${year}-${month}-${day}`;
  return today;
}

export default function ModalTransaction({
  isOpen,
  selectedTransaction = null,
  onClose,
  onSave,
}) {
  const [description, setDescription] = useState('');
  const [value, setValue] = useState(0);
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(today());
  const [mode, setMode] = useState('insert');

  const [type, setType] = useState(
    !!selectedTransaction ? selectedTransaction.type : '-'
  );

  useEffect(() => {
    if (!selectedTransaction) {
      setMode('insert');
      return;
    }

    const { description, value, category, yearMonthDay } = selectedTransaction;

    setDescription(description);
    setValue(value);
    setCategory(category);
    setDate(yearMonthDay);
    setMode('edit');
  }, [selectedTransaction]);

  const handleTypeChange = (event) => {
    const newType = event.target.value;
    setType(newType);
  };

  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    setCategory(newCategory);
  };

  const handleDescriptionChange = (event) => {
    const newDescription = event.target.value;
    setDescription(newDescription);
  };

  const handleValueChange = (event) => {
    const newValue = +event.target.value;
    setValue(newValue);
  };

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setDate(newDate);
  };

  const handleCloseClick = () => {
    onClose();
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const newTransaction = !selectedTransaction
      ? {
          description,
          value,
          yearMonthDay: date,
          category,
          type,
        }
      : {
          id: selectedTransaction.id,
          description,
          value,
          yearMonthDay: date,
          category,
          type,
        };

    onSave(newTransaction, mode);

    // setDescription('');
    // setCategory('');
    // setValue(0);
    // setDate(today());
  };

  const canSave = () => {
    return description.trim() !== '' && category.trim() !== '';
  };

  const title =
    mode === 'insert' ? 'Inclusão de lançamento' : 'Edição de lançamento';

  const {
    headerStyle,
    modalStyle,
    formStyle,
    radioStyle,
    radioButtonStyle,
    earningExpenseStyle,
  } = styles;

  const earningTextStyle =
    mode === 'insert'
      ? { color: EARNING_COLOR, ...earningExpenseStyle }
      : earningExpenseStyle;

  const expenseTextStyle =
    mode === 'insert'
      ? { color: EXPENSE_COLOR, ...earningExpenseStyle }
      : earningExpenseStyle;

  return (
    <Modal isOpen={isOpen} contentLabel='Example Modal' style={modalStyle}>
      <div>
        <div style={headerStyle}>
          <h3 style={{ marginRight: '10px', fontWeight: 'bold' }}>{title}</h3>

          <button
            className='waves-effect waves-light btn red darken-4'
            onClick={handleCloseClick}
          >
            X
          </button>
        </div>

        <form onSubmit={handleFormSubmit}>
          <div style={formStyle}>
            <div style={radioStyle}>
              <label style={{ ...radioButtonStyle }}>
                <input
                  name='expense-earning'
                  type='radio'
                  value='-'
                  checked={type === '-'}
                  onChange={handleTypeChange}
                  disabled={mode !== 'insert'}
                />
                <span style={expenseTextStyle}>Despesa</span>
              </label>

              <label style={radioButtonStyle}>
                <input
                  name='expense-earning'
                  type='radio'
                  value='+'
                  checked={type === '+'}
                  onChange={handleTypeChange}
                  disabled={mode !== 'insert'}
                />
                <span style={earningTextStyle}>Receita</span>
              </label>
            </div>

            <div className='input-field '>
              <input
                id='inputDescription'
                type='text'
                value={description}
                onChange={handleDescriptionChange}
                autoFocus
                required
              />
              <label htmlFor='inputDescription' className='active'>
                Descrição:
              </label>
            </div>

            <div className='input-field '>
              <input
                id='inputCategory'
                type='text'
                value={category}
                onChange={handleCategoryChange}
                required
              />
              <label htmlFor='inputCategory' className='active'>
                Categoria:
              </label>
            </div>

            <div style={headerStyle}>
              <div className='input-field' style={{ marginRight: '10px' }}>
                <input
                  id='inputValue'
                  type='number'
                  min='0'
                  step='0.01'
                  value={value}
                  onChange={handleValueChange}
                  required
                />
                <label htmlFor='inputValue' className='active'>
                  Valor:
                </label>
              </div>

              <input
                placeholder='Data'
                type='date'
                className='browser-default'
                value={date}
                onChange={handleDateChange}
                required
              />
            </div>
          </div>

          <input
            type='submit'
            className='waves-effect waves-light btn'
            value='Salvar'
            disabled={!canSave()}
          />
        </form>
      </div>
    </Modal>
  );
}

const styles = {
  modalStyle: {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  },

  headerStyle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  formStyle: {
    border: '1px solid lightgrey',
    borderRadius: '4px',
    padding: '10px',
    marginBottom: '10px',
  },

  radioStyle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '30px',
  },

  radioButtonStyle: {
    marginRight: '10px',
    marginLeft: '10px',
    padding: '20px',
  },

  earningExpenseStyle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
};
