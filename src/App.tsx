import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import {
    Box,
    Container,
    Fab,
    Paper,
    Tab,
    Tabs,
    Typography
} from '@mui/material';
import React, { useState } from 'react';

// Custom components
import AddUrlDialog from './components/AddUrlDialog';
import DomainSummary from './components/DomainSummary';
import FeedbackSnackbar from './components/FeedbackSnackbar';
import ScrapeResultsTable from './components/ScrapeResultsTable';

// Custom hook
import useWebScraper from './hooks/useWebScraper';

const App: React.FC = () => {
  const { 
    scrapeResults, 
    isLoading, 
    domainSummary, 
    fetchScrapeResults, 
    scrapeUrl,
    error
  } = useWebScraper();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [tabValue, setTabValue] = useState<number>(0);
  const [isHistorySectionOpen, setIsHistorySectionOpen] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  
  // The fetchScrapeResults function is now called only on initial load in the useWebScraper hook
  
  const handleAddClick = () => {
    setIsAddDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsAddDialogOpen(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const toggleHistorySection = () => {
    setIsHistorySectionOpen(!isHistorySectionOpen);
  };

  // Function to manually refresh data
  const handleRefresh = () => {
    fetchScrapeResults()
      .then(() => {
        showSnackbar('Data refreshed successfully!', 'success');
      })
      .catch(() => {
        showSnackbar('Failed to refresh data. Please try again.', 'error');
      });
  };

  // Function to handle scraping a URL
  const handleScrapeUrl = async (url: string): Promise<boolean> => {
    try {
      const success = await scrapeUrl(url);
      if (success) {
        showSnackbar('URL has been submitted for scraping.', 'success');
        return true;
      } else {
        showSnackbar('Failed to submit URL. Please try again.', 'error');
        return false;
      }
    } catch (err) {
      showSnackbar('An error occurred. Please try again.', 'error');
      return false;
    }
  };

  // Helper function to show snackbar messages
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Handle closing the snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Web Scraper Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Fab 
            color="secondary" 
            aria-label="refresh" 
            size="small" 
            onClick={handleRefresh}
            sx={{ mr: 1 }}
          >
            <RefreshIcon />
          </Fab>
          <Fab color="primary" aria-label="add" onClick={handleAddClick}>
            <AddIcon />
          </Fab>
        </Box>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
          <Tab label="Scraped URLs" />
        </Tabs>
        
        <Box sx={{ p: 2 }}>
          {tabValue === 0 && (
            <>
              <ScrapeResultsTable scrapeResults={scrapeResults} />
              <DomainSummary 
                domainSummary={domainSummary} 
                expanded={isHistorySectionOpen}
                onToggle={toggleHistorySection}
              />
            </>
          )}
        </Box>
      </Paper>

      <AddUrlDialog
        open={isAddDialogOpen}
        isLoading={isLoading}
        onClose={handleDialogClose}
        onSubmit={handleScrapeUrl}
      />

      <FeedbackSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
      />
    </Container>
  );
};

export default App; 