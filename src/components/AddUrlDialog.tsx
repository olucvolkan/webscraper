import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from '@mui/material';
import React, { useState } from 'react';

interface AddUrlDialogProps {
  open: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (url: string) => Promise<boolean>;
}

const AddUrlDialog: React.FC<AddUrlDialogProps> = ({ open, isLoading, onClose, onSubmit }) => {
  const [url, setUrl] = useState<string>('');
  const [urlError, setUrlError] = useState<string>('');
  
  const handleClose = () => {
    setUrl('');
    setUrlError('');
    onClose();
  };
  
  const validateUrl = (urlToValidate: string): boolean => {
    try {
      new URL(urlToValidate);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  const handleSubmit = async () => {
    if (!validateUrl(url)) {
      setUrlError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }
    
    const success = await onSubmit(url);
    if (success) {
      handleClose();
    }
  };
  
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add URL to Scrape</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="url"
          label="URL"
          type="url"
          fullWidth
          variant="outlined"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          error={!!urlError}
          helperText={urlError}
          sx={{ mt: 1, minWidth: 400 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : undefined}
        >
          {isLoading ? 'Processing...' : 'Scrape'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUrlDialog; 