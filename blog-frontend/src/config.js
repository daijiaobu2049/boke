const config = {
    apiUrl: process.env.NODE_ENV === 'production'
        ? 'https://你的后端服务器地址.com/api'
        : 'http://localhost:5000/api'
};

export default config; 