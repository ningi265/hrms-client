import { useAuth } from "../../../authcontext/authcontext";

const backendUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_BACKEND_URL_PROD
      : process.env.REACT_APP_BACKEND_URL_DEV;
  
// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
    };
};

// Helper function for form data headers
const getFormDataHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        ...(token && { Authorization: `Bearer ${token}` })
        // Don't set Content-Type for FormData, let browser set it
    };
};

// User Profile API
export const userAPI = {

     // Payment Methods API
    getPaymentMethods: async () => {
        const response = await fetch(`${backendUrl}/auth/payment-methods`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch payment methods');
        }
        
        return response.json();
    },

    addPaymentMethod: async (paymentData) => {
        const response = await fetch(`${backendUrl}/auth/payment-methods`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(paymentData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add payment method');
        }
        
        return response.json();
    },

    updatePaymentMethod: async (paymentMethodId, updateData) => {
        const response = await fetch(`${backendUrl}/auth/payment-methods/${paymentMethodId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(updateData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update payment method');
        }
        
        return response.json();
    },

    deletePaymentMethod: async (paymentMethodId) => {
        const response = await fetch(`${backendUrl}/auth/payment-methods/${paymentMethodId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete payment method');
        }
        
        return response.json();
    },

    setDefaultPaymentMethod: async (paymentMethodId) => {
        const response = await fetch(`${backendUrl}/auth/payment-methods/${paymentMethodId}/default`, {
            method: 'PUT',
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to set default payment method');
        }
        
        return response.json();
    },

    // Get user profile
    getProfile: async () => {
        const response = await fetch(`${backendUrl}/auth/profile`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch profile');
        }
        
        return response.json();
    },

    // Update user profile
    updateProfile: async (profileData) => {
        const response = await fetch(`${backendUrl}/auth/profile`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(profileData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to update profile');
        }
        
        return response.json();
    },

    // Update security settings
    updateSecuritySettings: async (securityData) => {
        const response = await fetch(`${backendUrl}/auth/security`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(securityData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to update security settings');
        }
        
        return response.json();
    },

    // Change password
    changePassword: async (passwordData) => {
        const response = await fetch(`${backendUrl}/auth/change-password`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(passwordData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to change password');
        }
        
        return response.json();
    },

    // Update email
    updateEmail: async (emailData) => {
        const response = await fetch(`${backendUrl}/auth/update-email`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(emailData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update email');
        }
        
        return response.json();
    },

    // Get user statistics
    getUserStats: async () => {
        const response = await fetch(`${backendUrl}/auth/stats`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch user statistics');
        }
        
        return response.json();
    },

    // Upload avatar
    uploadAvatar: async (file) => {
        const formData = new FormData();
        formData.append('avatar', file);
        
        const response = await fetch(`${backendUrl}/auth/upload-avatar`, {
            method: 'POST',
            headers: getFormDataHeaders(),
            body: formData
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to upload avatar');
        }
        
        return response.json();
    },

    // Upload logo (keeping existing method for backward compatibility)
    uploadLogo: async (file, email) => {
        const formData = new FormData();
        formData.append('logo', file);
        formData.append('email', email);
        
        const response = await fetch(`${backendUrl}/auth/upload-logo`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to upload logo');
        }
        
        return response.json();
    },

    // Upload signature (keeping existing method for backward compatibility)
    uploadSignature: async (file, email) => {
        const formData = new FormData();
        formData.append('signature', file);
        formData.append('email', email);
        
        const response = await fetch(`${backendUrl}/auth/upload-signature`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to upload signature');
        }
        
        return response.json();
    },

    // Delete account
    deleteAccount: async (password) => {
        const response = await fetch(`${backendUrl}/auth/account`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
            body: JSON.stringify({ 
                password, 
                confirmDeletion: 'DELETE' 
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete account');
        }
        
        return response.json();
    }
};
