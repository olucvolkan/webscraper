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

This will connect to the local mock API server.

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start the development server and the mock API server together
npm run dev

# OR start each server separately:
# Start only the React frontend
npm start

# Start only the mock API server
npm run mock-api
```

The frontend application will be available at [http://localhost:3000](http://localhost:3000).
The mock API server will be available at [http://localhost:5000](http://localhost:5000).

## Mock API Server

This project includes a mock API server that provides fake data for development purposes. The mock server is built using json-server and provides the following endpoints:

- `GET /scrapes` - Returns a list of all scraped URLs
- `GET /scrapes/:id` - Returns details for a specific scrape
- `POST /scrape` - Accepts a URL in the request body and simulates starting a scrape job

### Mock API Response Structure

#### GET /scrapes

```json
[
  {
    "id": "1",
    "domain": "example.com",
    "url": "https://example.com",
    "duration": 350,
    "timestamp": "2023-05-19T15:22:45.000Z",
    "tagCount": 124,
    "status": "done"
  },
  ...
]
```

#### POST /scrape

Request:
```json
{
  "url": "https://example.com"
}
```

Response:
```json
{
  "success": true,
  "id": "unique-id",
  "message": "URL scraping has been initiated"
}
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the React app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run mock-api`

Runs the mock API server at [http://localhost:5000](http://localhost:5000).

### `npm run dev`

Runs both the React app and the mock API server concurrently.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## License

MIT