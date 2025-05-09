import { startScheduledContentProcessor } from '../jobs/processScheduledContent';

async function startJobs() {
  try {
    // Start the scheduled content processor
    startScheduledContentProcessor();
    console.log('Started scheduled content processor');

    // Add more job starters here as needed
  } catch (error) {
    console.error('Error starting jobs:', error);
    process.exit(1);
  }
}

// Start all jobs
startJobs(); 