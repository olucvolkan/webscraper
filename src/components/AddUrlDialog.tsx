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
import InfoModal from './InfoModal';

interface AddUrlDialogProps {
  open: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (url: string) => Promise<boolean>;
}

const AddUrlDialog: React.FC<AddUrlDialogProps> = ({ open, isLoading, onClose, onSubmit }) => {
  const [url, setUrl] = useState<string>('');
  const [urlError, setUrlError] = useState<string>('');
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  
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
      // Show the info modal instead of immediately closing
      setSubmitSuccess(true);
      setShowInfoModal(true);
      // Close the Add URL dialog
      handleClose();
    } else {
      setUrlError('Failed to submit URL for scraping');
    }
  };

  const handleInfoModalClose = () => {
    setShowInfoModal(false);
    setSubmitSuccess(false);
  };
  
  return (
    <>
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

      <InfoModal
        open={showInfoModal}
        onClose={handleInfoModalClose}
        title="Scraping in Progress"
        message="We are scraping the URL now. This may take a few moments. Once the scraping process is complete, you'll see the results in the table. The status will change from 'in_progress' to 'done' when finished."
        loading={false}
        success={submitSuccess}
      />
    </>
  );
};

export default AddUrlDialog; 