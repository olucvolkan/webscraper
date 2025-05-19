import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';

test('renders Web Scraper Dashboard heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Web Scraper Dashboard/i);
  expect(headingElement).toBeInTheDocument();
}); 