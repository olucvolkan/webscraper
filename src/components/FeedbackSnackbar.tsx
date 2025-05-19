import {
    Alert,
    AlertColor,
    Snackbar
} from '@mui/material';
import React from 'react';

interface FeedbackSnackbarProps {
  open: boolean;
  message: string;
  severity: AlertColor;
  onClose: () => void;
  autoHideDuration?: number;
}

const FeedbackSnackbar: React.FC<FeedbackSnackbarProps> = ({ 
  open, 
  message, 
  severity, 
  onClose,
  autoHideDuration = 6000 
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert 
        onClose={onClose} 
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default FeedbackSnackbar; 