const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();

app.use(cors({
    origin: ['https://daijiaobu2049.github.io', 'http://localhost:5500'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// 提供静态文件访问
app.use(express.static(path.join(__dirname)));

// 存储博客文章
let posts = [
    {
        id: 1,
        title: '探索现代 Web 开发技术',
        date: '2024-03-08',
        summary: '现代 Web 开发技术日新月异，本文将探讨最新的前端开发趋势和技术栈...',
        tags: ['技术', '前端', 'Web开发'],
        content: '文章内容...'
    }
];

// 建议:
// 使用数据库存储文章数据，例如 MongoDB
const Post = require('./models/Post');

// 验证码存储
const captchas = new Map();

// 生成验证码
function generateCaptcha() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// 获取所有文章
app.get('/api/posts', (req, res) => {
    res.json(posts);
});

// 获取单篇文章
app.get('/api/posts/:id', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).json({ message: '文章不存在' });
    res.json(post);
});

// 添加新文章
app.post('/api/posts', (req, res) => {
    const post = {
        id: Date.now(),
        ...req.body,
        date: new Date().toISOString().split('T')[0]
    };
    posts.unshift(post);
    res.status(201).json(post);
});

// 更新文章
app.put('/api/posts/:id', (req, res) => {
    const index = posts.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: '文章不存在' });
    
    posts[index] = { ...posts[index], ...req.body };
    res.json(posts[index]);
});

// 删除文章
app.delete('/api/posts/:id', (req, res) => {
    const index = posts.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: '文章不存在' });
    
    posts.splice(index, 1);
    res.status(204).send();
});

// 获取验证码
app.get('/api/captcha', (req, res) => {
    const id = Date.now().toString();
    const code = generateCaptcha();
    captchas.set(id, {
        code,
        timestamp: Date.now()
    });
    res.json({ id, code });
});

// 验证验证码
app.post('/api/verify-captcha', (req, res) => {
    const { id, code } = req.body;
    const captcha = captchas.get(id);
    
    if (!captcha) {
        return res.status(400).json({ message: '验证码已过期' });
    }
    
    if (captcha.code !== code) {
        return res.status(400).json({ message: '验证码错误' });
    }
    
    captchas.delete(id);
    res.json({ valid: true });
});

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
}); 