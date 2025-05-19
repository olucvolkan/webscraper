import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

// Types
export interface ScrapeResult {
  id: string;
  domain: string;
  url: string;
  duration: number;
  timestamp: string;
  tagCount: number;
  status: 'in_progress' | 'done' | 'failed';
}

export interface DomainSummary {
  domain: string;
  totalTagCount: number;
}

const useWebScraper = () => {
  const [scrapeResults, setScrapeResults] = useState<ScrapeResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [domainSummary, setDomainSummary] = useState<DomainSummary[]>([]);
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  const fetchScrapeResults = async () => {
    try {
      setError(null);
      const response = await axios.get(`${backendUrl}/scrapes`);
      setScrapeResults(response.data);
    } catch (err) {
      console.error('Error fetching scrape results:', err);
      setError('Failed to fetch scrape results');
    }
  };

  const scrapeUrl = async (url: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${backendUrl}/scrape`, { url });
      
      // Create a new scrape result with "in_progress" status
      const newScrapeResult: ScrapeResult = {
        id: response.data.id || `temp-${Date.now()}`,
        domain: new URL(url).hostname,
        url: url,
        duration: 0,
        timestamp: new Date().toISOString(),
        tagCount: 0,
        status: 'in_progress'
      };
      
      setScrapeResults(prev => [newScrapeResult, ...prev]);
      return true;
    } catch (err) {
      console.error('Error submitting URL for scraping:', err);
      setError('Failed to submit URL for scraping');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Use useCallback to memoize the function
  const calculateDomainSummary = useCallback(() => {
    const domainMap = new Map<string, number>();
    
    scrapeResults.forEach(result => {
      const currentCount = domainMap.get(result.domain) || 0;
      domainMap.set(result.domain, currentCount + result.tagCount);
    });
    
    const summary: DomainSummary[] = Array.from(domainMap.entries()).map(([domain, totalTagCount]) => ({
      domain,
      totalTagCount
    }));
    
    setDomainSummary(summary);
  }, [scrapeResults]);

  // Calculate domain summary whenever scrape results change
  useEffect(() => {
    calculateDomainSummary();
  }, [calculateDomainSummary]);

  return {
    scrapeResults,
    isLoading,
    error,
    domainSummary,
    fetchScrapeResults,
    scrapeUrl
  };
};

export default useWebScraper; 