const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 允许所有来源的请求或指定 GitHub Pages 域名
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://你的用户名.github.io', 'http://localhost:3000']
        : 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

// 连接数据库（使用环境变量中的 MongoDB URI）
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('数据库连接成功');
}).catch((err) => {
    console.error('数据库连接失败:', err);
});

mongoose.connection.on('error', err => {
    console.error('MongoDB 连接错误:', err);
});

app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: '服务器内部错误' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
}); 