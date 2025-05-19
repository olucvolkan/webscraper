import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
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
import { DomainSummary as DomainSummaryType } from '../hooks/useWebScraper';

interface DomainSummaryProps {
  domainSummary: DomainSummaryType[];
  expanded: boolean;
  onToggle: () => void;
}

const DomainSummary: React.FC<DomainSummaryProps> = ({ domainSummary, expanded, onToggle }) => {
  return (
    <Accordion
      expanded={expanded}
      onChange={onToggle}
      sx={{ mt: 2 }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="historical-summary-content"
        id="historical-summary-header"
      >
        <Typography>Historical Summary</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TableContainer component={Paper}>
          <Table aria-label="domain summary table">
            <TableHead>
              <TableRow>
                <TableCell>Domain</TableCell>
                <TableCell align="right">Total HTML Tag Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {domainSummary.length > 0 ? (
                domainSummary.map((row) => (
                  <TableRow key={row.domain}>
                    <TableCell component="th" scope="row">
                      {row.domain}
                    </TableCell>
                    <TableCell align="right">{row.totalTagCount}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No domain summary data available yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );
};

export default DomainSummary; 