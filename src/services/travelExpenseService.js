// services/travelExpenseService.js

const API_BASE_URL = import.meta.env.VITE_ENV === 'production'
  ? import.meta.env.VITE_BACKEND_URL_PROD
  : import.meta.env.VITE_BACKEND_URL_DEV;

class TravelExpenseService {
    
    // Get analytics data for charts
    static async getTravelExpenseAnalytics(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            if (params.period) queryParams.append('period', params.period);
            if (params.startDate) queryParams.append('startDate', params.startDate);
            if (params.endDate) queryParams.append('endDate', params.endDate);

            const url = `${API_BASE_URL}/api/travel-requests/analytics?${queryParams.toString()}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Error fetching travel expense analytics:', error);
            throw new Error('Failed to fetch analytics data: ' + error.message);
        }
    }

    // Export travel expense data
    static async exportTravelExpenseData(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            if (params.startDate) queryParams.append('startDate', params.startDate);
            if (params.endDate) queryParams.append('endDate', params.endDate);
            if (params.format) queryParams.append('format', params.format);

            const url = `${API_BASE_URL}/api/travel-requests/export?${queryParams.toString()}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth if needed
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // For CSV downloads, return blob
            if (params.format === 'csv') {
                return await response.blob();
            }

            return await response.json();

        } catch (error) {
            console.error('Error exporting travel expense data:', error);
            throw new Error('Failed to export data: ' + error.message);
        }
    }

    // Get individual travel request (make sure this calls the right endpoint)
     static async getTravelRequestById(id) {
  try {
    // Simple ID validation (24 char hex string)
    if (!id || typeof id !== 'string' || !/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new Error('Invalid travel request ID format');
    }

    const response = await fetch(`${API_BASE_URL}/api/travel-requests/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching travel request:', error);
    throw new Error('Failed to fetch travel request: ' + error.message);
  }
}

    // Get all travel requests
    static async getAllTravelRequests(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            if (params.page) queryParams.append('page', params.page);
            if (params.limit) queryParams.append('limit', params.limit);
            if (params.status) queryParams.append('status', params.status);

            const url = `${API_BASE_URL}/api/travel-requests?${queryParams.toString()}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();

        } catch (error) {
            console.error('Error fetching travel requests:', error);
            throw new Error('Failed to fetch travel requests: ' + error.message);
        }
    }
}

export default TravelExpenseService;