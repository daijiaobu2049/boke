const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'https://daijiaobu2049.github.io',
    credentials: true
}));
app.use(express.json());

// 路由
app.use('/api/verify', require('./routes/verify'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
}); 