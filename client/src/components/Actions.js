import React from 'react';

export default function Actions({ filterText, onFilter, onNewTransaction }) {
  const handleChangeFilterText = (event) => {
    const userText = event.target.value;
    onFilter(userText);
  };

  const handleButtonClick = () => {
    onNewTransaction();
  };

  const { containerStyle, inputStyle } = styles;

  return (
    <div style={containerStyle}>
      <button
        className='waves-effect waves-light btn'
        disabled={filterText.trim() !== ''}
        onClick={handleButtonClick}
      >
        + Novo lançamento
      </button>

      <div className='input-field' style={inputStyle}>
        <input
          placeholder='Filtro'
          type='text'
          value={filterText}
          onChange={handleChangeFilterText}
        />
      </div>
    </div>
  );
}

const styles = {
  containerStyle: {
    padding: '10px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  inputStyle: {
    marginLeft: '10px',
    display: 'flex',
    flex: 1,
  },
};
