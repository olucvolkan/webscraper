import { CheckCircle as CheckCircleIcon, Info as InfoIcon } from '@mui/icons-material';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography
} from '@mui/material';
import React from 'react';

interface InfoModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  loading?: boolean;
  success?: boolean;
}

const InfoModal: React.FC<InfoModalProps> = ({ 
  open, 
  onClose, 
  title, 
  message, 
  loading = false,
  success = false
}) => {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      aria-labelledby="info-dialog-title"
      aria-describedby="info-dialog-description"
    >
      <DialogTitle id="info-dialog-title">
        <Box display="flex" alignItems="center" gap={1}>
          {loading ? (
            <CircularProgress size={24} color="primary" />
          ) : success ? (
            <CheckCircleIcon color="success" />
          ) : (
            <InfoIcon color="primary" />
          )}
          <Typography variant="h6" component="span">
            {title}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="info-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose} 
          color="primary" 
          disabled={loading}
          autoFocus
        >
          {loading ? 'Processing...' : 'Close'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InfoModal; 