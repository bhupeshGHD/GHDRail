import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-api-endpoint.com', // Replace with your API base URL
  timeout: 10000, // Timeout for requests
});

export default api;
