import axios from "axios";

// Helper function for timeout
async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper function to fetch existing data (retry if needed)
async function fetchDataWithRetry(url, retryCount = 3, delay = 1000) {
  try {
    const response = await axios.get(url);
    return response;
  } catch (error) {
    if (retryCount > 0) {
      console.error(`Request failed. Retrying ${retryCount} more times...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchDataWithRetry(url, retryCount - 1, delay);
    } else {
      throw error;
    }
  }
}

export {
  delay,
  fetchDataWithRetry
};
