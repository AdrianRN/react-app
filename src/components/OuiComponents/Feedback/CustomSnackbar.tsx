import React from 'react';
import Snackbar from './Snackbar';
import Alert from './Alert';

interface CustomSnackbarProps {
    open: boolean;
    onClose: () => void;
    autoHideDuration: number;
    severity: "success" | "info" | "warning" | "error";
    message: string;
  }

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({ open, onClose, autoHideDuration, severity, message }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
    >
      <div>
        <Alert severity = {severity} >
          {message}
        </Alert>
      </div>
    </Snackbar>
  );
};

export default CustomSnackbar;
