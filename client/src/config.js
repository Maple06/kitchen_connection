export const getApiUrl = () => {
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }

  // Dynamic subdomain setup for production
  // Example: kitchenconnection.id -> https://api.kitchenconnection.id
  // Example: www.kitchenconnection.id -> https://api.kitchenconnection.id
  const parts = hostname.split('.');
  if (parts[0] === 'www') {
      parts.shift();
  }
  return `https://api.${parts.join('.')}`;
};

export const API_URL = getApiUrl();
