// Configuration de l'API
const API_BASE_URL = 'http://192.168.1.157:3000/api';

// Module API pour centraliser toutes les requêtes
const api = {
    // Méthode GET
    async get(endpoint, options = {}) {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
                ...options.headers
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'GET',
                headers,
                ...options
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Erreur ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur API GET:', error);
            throw error;
        }
    },

    // Méthode POST
    async post(endpoint, data, options = {}) {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
                ...options.headers
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
                ...options
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Erreur ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur API POST:', error);
            throw error;
        }
    },

    // Méthode PUT
    async put(endpoint, data, options = {}) {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
                ...options.headers
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(data),
                ...options
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Erreur ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur API PUT:', error);
            throw error;
        }
    },

    // Méthode DELETE
    async delete(endpoint, options = {}) {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
                ...options.headers
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'DELETE',
                headers,
                ...options
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Erreur ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur API DELETE:', error);
            throw error;
        }
    }
};

// Fonction utilitaire pour obtenir les régimes disponibles
async function getRegimes() {
    try {
        const response = await api.get('/regimes');
        return response.regimes || [];
    } catch (error) {
        console.error('Erreur récupération régimes:', error);
        return [];
    }
}


