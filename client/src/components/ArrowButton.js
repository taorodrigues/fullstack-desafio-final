import React from 'react';

export default function Button({
  type = 'left',
  buttonDisabled = false,
  onButtonClick = null,
}) {
  const handleButtonClick = () => {
    onButtonClick(null);
  };

  return (
    <button
      className='waves-effect waves-light btn'
      style={{
        marginLeft: '5px',
        marginRight: '5px',
        fontWeight: 'bold',
      }}
      disabled={buttonDisabled}
      onClick={handleButtonClick}
    >
      {type === 'left' ? '<' : '>'}
    </button>
  );
}
