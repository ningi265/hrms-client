import axios from 'axios';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const API_URL = `${backendUrl}/api/travel-requests`;

// Get dashboard overview data
const getDashboardOverview = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/dashboard/overview`, config);
  return response.data;
};

// Get travel statistics
const getTravelStats = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/dashboard/stats`, config);
  return response.data;
};

// Get quick links data
const getQuickLinksData = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/dashboard/quick-links`, config);
  return response.data;
};

// Get recent travel requests
const getRecentRequests = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/recent`, config);
  return response.data;
};

// Get upcoming trips
const getUpcomingTrips = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/upcoming`, config);
  return response.data;
};

const travelService = {
  getDashboardOverview,
  getTravelStats,
  getQuickLinksData,
  getRecentRequests,
  getUpcomingTrips,
};

export default travelService;