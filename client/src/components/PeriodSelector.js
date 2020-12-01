import React, { useState, useEffect } from 'react';

import ArrowButton from './ArrowButton';

export default function PeriodSelector({
  allPeriods,
  selectedPeriod,
  onChangePeriod,
}) {
  const [isFirstPeriod, setIsFirstPeriod] = useState(false);
  const [isLastPeriod, setIsLastPeriod] = useState(false);

  useEffect(() => {
    if (!allPeriods || !selectedPeriod) {
      return;
    }

    const checkIsFirstPeriod = () => selectedPeriod.index === 0;

    const checkIsLastPeriod = () =>
      selectedPeriod.index === allPeriods.length - 1;

    setIsFirstPeriod(checkIsFirstPeriod(selectedPeriod.index));
    setIsLastPeriod(checkIsLastPeriod(selectedPeriod.index));
  }, [selectedPeriod, allPeriods]);

  const handleSelectChange = (event) => {
    onChangePeriod(
      allPeriods.find((period) => period.id === event.target.value)
    );
  };

  const handleLeftButtonClick = () => {
    const index = allPeriods.findIndex((item) => item.id === selectedPeriod.id);

    onChangePeriod(allPeriods[index - 1]);
  };

  const handleRightButtonClick = () => {
    const index = allPeriods.findIndex((item) => item.id === selectedPeriod.id);

    onChangePeriod(allPeriods[index + 1]);
  };

  const { flexRowStyle, selectStyle } = styles;

  if (allPeriods.length === 0 || !selectedPeriod) {
    return null;
  }

  return (
    <div className='center' style={flexRowStyle}>
      <ArrowButton
        type='left'
        onButtonClick={handleLeftButtonClick}
        buttonDisabled={isFirstPeriod}
      />

      <select
        className='browser-default'
        style={selectStyle}
        value={selectedPeriod.id}
        onChange={handleSelectChange}
      >
        {allPeriods.map((period) => {
          const { id, description } = period;

          return (
            <option key={id} value={id}>
              {description}
            </option>
          );
        })}
      </select>

      <ArrowButton
        type='right'
        onButtonClick={handleRightButtonClick}
        buttonDisabled={isLastPeriod}
      />
    </div>
  );
}

const styles = {
  flexRowStyle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '10px',
  },

  selectStyle: {
    width: '150px',
    fontFamily: "'Fira Code Retina', Consolas, monospace, Arial",
  },
};
