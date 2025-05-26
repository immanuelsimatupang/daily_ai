const cron = require('node-cron');
const { fetchAndStoreNews } = require('../controllers/curatedNewsController');

// --- IMPORTANT ---
// This is a simplified version of calling fetchAndStoreNews for a cron job.
// In a real app, fetchAndStoreNews is an Express controller expecting (req, res).
// For a background job, you wouldn't have `req` and `res`.
// You'd ideally refactor fetchAndStoreNews to extract the core logic
// into a separate function that can be called by both the controller and the cron job.
//
// For this task, we'll simulate a call by creating a mock/minimal req and res,
// or by refactoring `fetchAndStoreNews` if it's straightforward.
//
// Given the current structure of fetchAndStoreNews, which sends HTTP responses,
// directly calling it isn't ideal. The best approach is to extract its core logic.
//
// Let's assume for now we create a wrapper or directly call a simplified version
// if fetchAndStoreNews's core logic can be easily adapted.
// For this step, we will create a placeholder that logs the action.
// A subsequent step would be to refactor `fetchAndStoreNews` to be callable from here.

const scheduleNewsFetching = () => {
  // Schedule to run every 6 hours: '0 */6 * * *'
  // For testing, you might use a more frequent schedule like '*/5 * * * *' (every 5 minutes)
  cron.schedule('0 */6 * * *', async () => {
    console.log('-------------------------------------');
    console.log('Running scheduled news fetching job - ' + new Date().toISOString());
    try {
      // --- Placeholder for calling the actual fetching logic ---
      // Ideally, you would call a refactored function here that contains
      // the core logic of fetchAndStoreNews without req/res.
      // For example: await actualNewsFetchingService();
      //
      // For now, we'll just log that the job would run.
      // If `fetchAndStoreNews` could be called directly (e.g., if it didn't strictly depend on req/res),
      // you might try:
      // await fetchAndStoreNews({}, { json: (data) => console.log('Scheduled job response:', data), status: (code) => ({ json: (data) => console.log(`Scheduled job status ${code}:`, data) }) });
      // But this is a hack due to its Express controller nature.
      
      // Call the exported controller function with mock req and res
      const mockReq = null; // Or an empty object {}
      const mockRes = {
        status: function(statusCode) {
          console.log(`[Scheduler Job] fetchAndStoreNews call - Status: ${statusCode}`);
          return this; // for chaining .json()
        },
        json: function(data) {
          console.log(`[Scheduler Job] fetchAndStoreNews call - Response:`, data);
        }
      };
      
      console.log('Attempting to run fetchAndStoreNews via scheduler...');
      await fetchAndStoreNews(mockReq, mockRes);
      console.log('Scheduled news fetching job completed.');
      console.log('-------------------------------------');

    } catch (error) {
      console.error('Error during scheduled news fetching execution:', error);
      console.log('-------------------------------------');
    }
  });

  console.log('📰 News fetching scheduler initialized. Job will run every 6 hours.');
};

module.exports = { scheduleNewsFetching };
