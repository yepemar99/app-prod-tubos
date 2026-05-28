import { Box, Typography } from '@mui/material';
import ProduccionTuboForm from './components/Form';
import React, { useContext } from 'react';
import { DataContext } from '../../contexts/DataContext';
import Loading from '../Loading/Loading';
import Control from '../control/Control';

const Home = () => {
  const [showControl, setShowControl] = React.useState(false);
  const { operarios, maquinas, tiposCalidad, loading } =
    useContext(DataContext);
  const [contolDID, setControlDID] = React.useState('');

  const toggleShowControl = () => {
    setShowControl((prev) => !prev);
  };

  const handleControlDID = (did) => {
    setControlDID(did);
  };

  return loading ? (
    <Loading />
  ) : (
    <Box>
      {showControl ? (
        <Control
          toggleShowMain={toggleShowControl}
          handleControlDID={handleControlDID}
        />
      ) : (
        <ProduccionTuboForm
          handleToggleControl={toggleShowControl}
          contolDID={contolDID}
          handleControlDID={handleControlDID}
        />
      )}
    </Box>
  );
};

export default Home;
