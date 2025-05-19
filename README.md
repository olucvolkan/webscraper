# Web Scraper Dashboard

A simple, elegant, and responsive Web Scraper Dashboard UI built with React and Material UI.

## Features

- **Main Table View**: Display a data table showing all previously crawled domains with details like domain name, URL, request duration, timestamp, HTML tag count, and status.
- **Add URL Functionality**: A prominent Add button to enter a new URL for crawling.
- **Status Updates**: Auto-refreshing table to monitor the status of each crawl operation.
- **Historical Summary**: View total HTML tag counts per domain in a collapsible panel.
- **Responsive Design**: Built with Material UI for a clean, modern, and responsive interface.

## Setup Instructions

### Prerequisites

- Node.js (>= 14.x)
- npm or yarn

### Environment Variables

Create a `.env` file in the root directory with the following content:

```
REACT_APP_BACKEND_URL=http://localhost:5000
```

Replace the URL with your actual backend service URL.

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## Backend Integration

This frontend requires a backend service that exposes the following endpoints:

- `GET /scrapes` - Fetches a list of all crawled domains and their data
- `POST /scrape` - Accepts a URL in the request body and starts the crawling process

## License

MIT