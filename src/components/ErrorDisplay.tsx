import { Alert, Box } from '@mui/material';
import React from 'react';

interface ErrorDisplayProps {
  error: string | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Alert severity="error" variant="filled">
        {error}
      </Alert>
    </Box>
  );
};

export default ErrorDisplay; 