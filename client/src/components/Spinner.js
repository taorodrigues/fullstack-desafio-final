import React from 'react';

export default function Spinner({ children }) {
  const { spinnerStyle } = styles;

  return (
    <div className='center' style={spinnerStyle}>
      <div className='preloader-wrapper small active'>
        <div className='spinner-layer spinner-blue-only'>
          <div className='circle-clipper left'>
            <div className='circle'></div>
          </div>
          <div className='gap-patch'>
            <div className='circle'></div>
          </div>
          <div className='circle-clipper right'>
            <div className='circle'></div>
          </div>
        </div>
      </div>
      <div style={{ marginLeft: '20px' }}>{children}</div>
    </div>
  );
}

const styles = {
  spinnerStyle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '30px',
  },
};
