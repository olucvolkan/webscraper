import {
    Chip,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import React from 'react';
import { ScrapeResult } from '../hooks/useWebScraper';

interface ScrapeResultsTableProps {
  scrapeResults: ScrapeResult[];
}

const ScrapeResultsTable: React.FC<ScrapeResultsTableProps> = ({ scrapeResults }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'warning';
      case 'done':
        return 'success';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDuration = (ms: number) => {
    if (ms === 0) return '-';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="scrape results table">
        <TableHead>
          <TableRow>
            <TableCell>Domain</TableCell>
            <TableCell>URL</TableCell>
            <TableCell align="right">Duration</TableCell>
            <TableCell>Timestamp</TableCell>
            <TableCell align="right">HTML Tag Count</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {scrapeResults.length > 0 ? (
            scrapeResults.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.domain}
                </TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {row.url}
                </TableCell>
                <TableCell align="right">{formatDuration(row.duration)}</TableCell>
                <TableCell>{formatTime(row.timestamp)}</TableCell>
                <TableCell align="right">{row.status === 'in_progress' ? '-' : row.tagCount}</TableCell>
                <TableCell>
                  <Chip 
                    label={row.status} 
                    color={getStatusColor(row.status) as "warning" | "success" | "error" | "default"} 
                    sx={{ textTransform: 'capitalize' }}
                    icon={row.status === 'in_progress' ? <CircularProgress size={16} color="inherit" /> : undefined}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No scrape results yet. Add a URL to start scraping.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ScrapeResultsTable; 