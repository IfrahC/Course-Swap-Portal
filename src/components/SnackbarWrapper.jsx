import React from 'react';
import { SnackbarProvider } from 'notistack';
import App from '../App'; // Ensure this path points to your App component

const SnackbarWrapper = () => {
  return (
    <SnackbarProvider autoHideDuration={3000}>
      <App />
    </SnackbarProvider>
  );
};

export default SnackbarWrapper;