const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

module.exports = (req, res, next) => {
  const dbPath = path.join(__dirname, 'db.json');
  
  // Handle POST to /scrape endpoint
  if (req.method === 'POST' && req.path === '/scrape') {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: 'URL is required' });
      }
      
      // Parse domain from URL
      let domain;
      try {
        domain = new URL(url).hostname;
      } catch (error) {
        return res.status(400).json({ error: 'Invalid URL format' });
      }
      
      // Generate a unique ID
      const id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
      
      // Read the current database
      const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      
      // Create a new scrape entry with "in_progress" status
      const newScrape = {
        id,
        domain,
        url,
        duration: 0,
        timestamp: new Date().toISOString(),
        tagCount: 0,
        status: 'in_progress'
      };
      
      // Add to the database
      db.scrapes.unshift(newScrape);
      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
      
      // Simulate processing delay
      setTimeout(() => {
        // Return a successful response with the ID
        res.status(200).json({ 
          success: true, 
          id,
          message: 'URL scraping has been initiated'
        });
      }, 500);
      
      // Simulate scraping completion after a random time between 5-15 seconds
      setTimeout(() => {
        // Read the current database again (it might have changed)
        const currentDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        
        // Find the scrape entry
        const scrapeIndex = currentDb.scrapes.findIndex(scrape => scrape.id === id);
        
        if (scrapeIndex !== -1) {
          // Update the scrape entry
          currentDb.scrapes[scrapeIndex] = {
            ...currentDb.scrapes[scrapeIndex],
            status: 'done',
            duration: Math.floor(Math.random() * 1000) + 300, // Random duration between 300-1300ms
            tagCount: Math.floor(Math.random() * 500) + 100, // Random tag count between 100-600
          };
          
          // Write back to the database
          fs.writeFileSync(dbPath, JSON.stringify(currentDb, null, 2));
        }
      }, Math.floor(Math.random() * 10000) + 5000); // Random time between 5-15 seconds
      
      // We've already handled the response, so we don't call next()
      return;
    } catch (error) {
      console.error('Error processing scrape request:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // For all other requests, continue to JSON Server router
  next();
}; 