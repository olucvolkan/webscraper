import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

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

// Response type for POST /scrape
interface ScrapeResponse {
  success: boolean;
  id: string;
  message: string;
}

const useWebScraper = () => {
  const [scrapeResults, setScrapeResults] = useState<ScrapeResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [domainSummary, setDomainSummary] = useState<DomainSummary[]>([]);
  const hasInProgressRef = useRef<boolean>(false);
  const inProgressTimerRef = useRef<number | null>(null);
  
  // Hardcoded for development until .env works
  const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:8081';

  const fetchScrapeResults = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      const response = await axios.get<ScrapeResult[]>(`${backendUrl}/scrapes`);
      setScrapeResults(response.data);
      
      // Check if there are any in-progress scrapes
      const hasInProgress = response.data.some(result => result.status === 'in_progress');
      hasInProgressRef.current = hasInProgress;
      
      // If there are in-progress scrapes, set a timer to check again
      if (hasInProgress) {
        startInProgressTimer();
      } else if (inProgressTimerRef.current) {
        // If there are no in-progress scrapes but we have a timer, clear it
        clearInProgressTimer();
      }
    } catch (err) {
      console.error('Error fetching scrape results:', err);
      setError('Failed to fetch scrape results');
      throw err; // Re-throw to allow handling in the component
    }
  }, [backendUrl]);

  // Start a timer to periodically refresh while there are in-progress scrapes
  const startInProgressTimer = () => {
    // Clear any existing timer
    clearInProgressTimer();
    
    // Set a new timer to check every 3 seconds
    inProgressTimerRef.current = window.setInterval(() => {
      if (hasInProgressRef.current) {
        fetchScrapeResults();
      } else {
        clearInProgressTimer();
      }
    }, 3000);
  };

  // Clear the in-progress timer
  const clearInProgressTimer = () => {
    if (inProgressTimerRef.current) {
      clearInterval(inProgressTimerRef.current);
      inProgressTimerRef.current = null;
    }
  };

  const scrapeUrl = async (url: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post<ScrapeResponse>(`${backendUrl}/scrape`, { url });
      
      if (response.data.success) {
        // Create a new scrape result with "in_progress" status
        const newScrapeResult: ScrapeResult = {
          id: response.data.id,
          domain: new URL(url).hostname,
          url: url,
          duration: 0,
          timestamp: new Date().toISOString(),
          tagCount: 0,
          status: 'in_progress'
        };
        
        setScrapeResults(prev => [newScrapeResult, ...prev]);
        
        // Start checking for updates since we have an in-progress scrape
        hasInProgressRef.current = true;
        startInProgressTimer();
        
        return true;
      } else {
        setError('Failed to initiate scraping');
        return false;
      }
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

  // Fetch data only when the component mounts (page loads/refreshes)
  useEffect(() => {
    fetchScrapeResults();
    
    // Event listener for visibility change to refresh data when tab becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchScrapeResults();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInProgressTimer();
    };
  }, [fetchScrapeResults]);

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