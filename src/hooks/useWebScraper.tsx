import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

// Types
export interface Website {
  id: number;
  url: string;
  domain: string;
  status: 'waiting' | 'processing' | 'completed' | 'failed';
  htmlTagCount: number | null;
  requestDuration: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface DomainSummary {
  domain: string;
  totalTagCount: number;
}

// API Response Types
interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

interface CrawlResponse {
  id: number;
  status: string;
}

const useWebScraper = () => {
  const [scrapeResults, setScrapeResults] = useState<Website[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [domainSummary, setDomainSummary] = useState<DomainSummary[]>([]);
  const hasInProgressRef = useRef<boolean>(false);
  const inProgressTimerRef = useRef<number | null>(null);
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';
  
  console.log('Environment:', {
    REACT_APP_BACKEND_URL: process.env.REACT_APP_BACKEND_URL,
    backendUrl
  });

  // Configure axios defaults
  useEffect(() => {
    axios.defaults.baseURL = backendUrl;
    axios.defaults.timeout = 10000; // 10 seconds timeout
    axios.defaults.headers.common['Content-Type'] = 'application/json';
  }, [backendUrl]);

  const fetchScrapeResults = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      console.log('Fetching results from:', `${backendUrl}/api/websites`);
      
      const response = await axios.get<ApiResponse<{ websites: Website[] }>>(`${backendUrl}/api/websites`);
      console.log('API Response:', response.data);
      
      if (response.data.status === 'success') {
        setScrapeResults(response.data.data.websites);
        
        const hasInProgress = response.data.data.websites.some(
          result => result.status === 'waiting' || result.status === 'processing'
        );
        hasInProgressRef.current = hasInProgress;
        
        if (hasInProgress) {
          startInProgressTimer();
        } else if (inProgressTimerRef.current) {
          clearInProgressTimer();
        }
      } else {
        setError('Failed to fetch websites');
      }
    } catch (error: unknown) {
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: axios.isAxiosError(error) ? error.code : 'UNKNOWN',
        response: axios.isAxiosError(error) ? error.response?.data : undefined,
        config: axios.isAxiosError(error) ? {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        } : undefined
      });
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          setError('Cannot connect to the server. Please check if the backend is running.');
        } else if (error.response) {
          setError(`Server error: ${error.response.status} - ${error.response.statusText}`);
        } else if (error.request) {
          setError('No response from server. Please check your internet connection.');
        } else {
          setError(`Request failed: ${error.message}`);
        }
      } else {
        setError('An unexpected error occurred');
      }
      throw error;
    }
  }, [backendUrl]);

  const startInProgressTimer = () => {
    clearInProgressTimer();
    
    inProgressTimerRef.current = window.setInterval(() => {
      if (hasInProgressRef.current) {
        fetchScrapeResults();
      } else {
        clearInProgressTimer();
      }
    }, 3000);
  };

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
      console.log('Sending crawl request to:', `${backendUrl}/api/crawler/crawl`);
      
      const response = await axios.get<ApiResponse<CrawlResponse>>(
        `${backendUrl}/api/crawler/crawl`,
        { 
          params: { url },
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      
      console.log('Crawl Response:', response.data);
      
      if (response.data.status === 'success') {
        hasInProgressRef.current = true;
        startInProgressTimer();
        await fetchScrapeResults();
        return true;
      } else {
        setError('Failed to initiate scraping');
        return false;
      }
    } catch (error: unknown) {
      console.error('Scrape Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: axios.isAxiosError(error) ? error.code : 'UNKNOWN',
        response: axios.isAxiosError(error) ? error.response?.data : undefined,
        config: axios.isAxiosError(error) ? {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        } : undefined
      });
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          setError('Cannot connect to the server. Please check if the backend is running.');
        } else if (error.response) {
          setError(`Server error: ${error.response.status} - ${error.response.statusText}`);
        } else if (error.request) {
          setError('No response from server. Please check your internet connection.');
        } else {
          setError(`Request failed: ${error.message}`);
        }
      } else {
        setError('An unexpected error occurred');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDomainSummary = useCallback(() => {
    const domainMap = new Map<string, number>();
    
    scrapeResults.forEach(result => {
      if (result.status === 'completed' && result.htmlTagCount !== null) {
        const currentCount = domainMap.get(result.domain) || 0;
        domainMap.set(result.domain, currentCount + result.htmlTagCount);
      }
    });
    
    const summary: DomainSummary[] = Array.from(domainMap.entries()).map(([domain, totalTagCount]) => ({
      domain,
      totalTagCount
    }));
    
    setDomainSummary(summary);
  }, [scrapeResults]);

  useEffect(() => {
    calculateDomainSummary();
  }, [calculateDomainSummary]);

  useEffect(() => {
    fetchScrapeResults();
    
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

  const fetchWebsiteById = async (id: number): Promise<Website | null> => {
    try {
      const response = await axios.get<ApiResponse<{ website: Website }>>(`${backendUrl}/api/websites/${id}`);
      
      if (response.data.status === 'success') {
        return response.data.data.website;
      } else {
        setError('Failed to fetch website details');
        return null;
      }
    } catch (error: unknown) {
      console.error('Error fetching website details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: axios.isAxiosError(error) ? error.code : 'UNKNOWN',
        response: axios.isAxiosError(error) ? error.response?.data : undefined
      });
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(`Failed to fetch website details: ${error.response.status}`);
        } else {
          setError('Failed to fetch website details');
        }
      }
      return null;
    }
  };

  return {
    scrapeResults,
    isLoading,
    error,
    domainSummary,
    fetchScrapeResults,
    scrapeUrl,
    fetchWebsiteById
  };
};

export default useWebScraper; 