const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 添加请求日志
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`, {
        body: req.body,
        headers: req.headers
    });
    next();
});

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'https://daijiaobu2049.github.io',
    credentials: true
}));
app.use(express.json());

// 路由
app.use('/api/verify', require('./routes/verify'));

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('[ERROR]', err);
    res.status(500).json({ message: '服务器错误', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`[${new Date().toISOString()}] 服务器启动在端口 ${PORT}`);
    console.log('[CONFIG] 环境变量:', {
        CORS_ORIGIN: process.env.CORS_ORIGIN,
        SMTP_USER: process.env.SMTP_USER,
        NODE_ENV: process.env.NODE_ENV
    });
}); 