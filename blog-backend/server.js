const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 添加详细的 CORS 配置
app.use(cors({
    origin: '*',  // 临时允许所有来源，方便调试
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// 存储验证码
const captchas = new Map();

// 生成验证码
function generateCaptcha() {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

// 获取验证码
app.get('/api/captcha', (req, res) => {
    console.log('收到验证码请求');
    const code = generateCaptcha();
    const id = Date.now().toString();
    
    console.log('生成的验证码:', code);
    
    // 存储验证码（5分钟有效）
    captchas.set(id, {
        text: code.toLowerCase(),
        expires: Date.now() + 5 * 60 * 1000
    });

    // 清理过期验证码
    for (const [key, value] of captchas.entries()) {
        if (value.expires < Date.now()) {
            captchas.delete(key);
        }
    }

    console.log('发送验证码响应');
    res.json({
        id: id,
        code: code
    });
});

// 验证验证码
app.post('/api/verify-captcha', (req, res) => {
    console.log('收到验证请求:', req.body);
    const { id, code } = req.body;
    const captcha = captchas.get(id);

    if (!captcha) {
        return res.status(400).json({ message: '验证码已过期' });
    }

    if (captcha.expires < Date.now()) {
        captchas.delete(id);
        return res.status(400).json({ message: '验证码已过期' });
    }

    if (code.toLowerCase() !== captcha.text) {
        return res.status(400).json({ message: '验证码错误' });
    }

    captchas.delete(id);
    res.json({ valid: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
    console.log('验证码服务已启动');
    console.log('CORS 配置:', {
        origin: '*',
        methods: ['GET', 'POST']
    });
}); 