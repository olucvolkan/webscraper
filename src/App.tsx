import { Add as AddIcon } from '@mui/icons-material';
import {
    Box,
    Container,
    Fab,
    Paper,
    Tab,
    Tabs,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';

// Custom components
import AddUrlDialog from './components/AddUrlDialog';
import DomainSummary from './components/DomainSummary';
import ScrapeResultsTable from './components/ScrapeResultsTable';

// Custom hook
import useWebScraper from './hooks/useWebScraper';

const App: React.FC = () => {
  const { 
    scrapeResults, 
    isLoading, 
    domainSummary, 
    fetchScrapeResults, 
    scrapeUrl 
  } = useWebScraper();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [tabValue, setTabValue] = useState<number>(0);
  const [isHistorySectionOpen, setIsHistorySectionOpen] = useState<boolean>(false);
  
  // Fetch initial data and set up polling
  useEffect(() => {
    fetchScrapeResults();
    const interval = setInterval(() => {
      fetchScrapeResults();
    }, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(interval);
  }, [fetchScrapeResults]);

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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Web Scraper Dashboard
        </Typography>
        <Fab color="primary" aria-label="add" onClick={handleAddClick}>
          <AddIcon />
        </Fab>
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
        onSubmit={scrapeUrl}
      />
    </Container>
  );
};

export default App; 