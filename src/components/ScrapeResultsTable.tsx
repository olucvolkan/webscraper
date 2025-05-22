import {
    Box,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import React from 'react';
import { Website } from '../hooks/useWebScraper';

interface ScrapeResultsTableProps {
  scrapeResults: Website[];
}

const ScrapeResultsTable: React.FC<ScrapeResultsTableProps> = ({ scrapeResults }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success.main';
      case 'failed':
        return 'error.main';
      case 'processing':
      case 'waiting':
        return 'warning.main';
      default:
        return 'text.primary';
    }
  };

  const formatDuration = (duration: number | null) => {
    if (duration === null) return '-';
    return `${duration.toFixed(3)}s`;
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>URL</TableCell>
            <TableCell>Domain</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">HTML Tags</TableCell>
            <TableCell align="right">Duration</TableCell>
            <TableCell>Timestamp</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {scrapeResults.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography variant="body1" color="textSecondary">
                  No scrape results yet. Add a URL to start scraping!
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            scrapeResults.map((result) => (
              <TableRow key={result.id}>
                <TableCell>{result.url}</TableCell>
                <TableCell>{result.domain}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {(result.status === 'processing' || result.status === 'waiting') && (
                      <CircularProgress size={16} />
                    )}
                    <Typography color={getStatusColor(result.status)}>
                      {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  {result.htmlTagCount !== null ? result.htmlTagCount : '-'}
                </TableCell>
                <TableCell align="right">
                  {formatDuration(result.requestDuration)}
                </TableCell>
                <TableCell>
                  {new Date(result.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ScrapeResultsTable; 