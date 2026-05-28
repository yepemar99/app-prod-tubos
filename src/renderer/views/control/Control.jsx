import React, { useContext } from 'react';
import ControlDimensionalForm from './components/Form';

const Control = ({ toggleShowMain, handleControlDID = () => {} }) => {
  return (
    <ControlDimensionalForm
      handleBackMenu={toggleShowMain}
      handleControlDID={handleControlDID}
    />
  );
};

export default Control;
