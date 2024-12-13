const config = {
    API_BASE_URL: process.env.NODE_ENV === 'production'
        ? 'https://pharma-management-19ch.onrender.com/api' // Production API URL
        : 'http://localhost:3000/api' // Local development API URL
};

export default config;
