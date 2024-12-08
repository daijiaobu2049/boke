const router = require('express').Router();
const { sendVerificationEmail } = require('../config/email');

// 存储验证码
const verificationCodes = new Map();

// 生成验证码
function generateCode() {
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += Math.floor(Math.random() * 10);
    }
    return code;
}

// 发送验证码
router.post('/send', async (req, res) => {
    const { email } = req.body;

    // 生成验证码
    const code = generateCode();
    
    // 存储验证码
    verificationCodes.set(email, {
        code,
        timestamp: Date.now(),
        attempts: 0
    });

    // 发送邮件
    const sent = await sendVerificationEmail(email, code);
    
    if (sent) {
        console.log(`验证码 ${code} 已发送到邮箱 ${email}`);
        res.json({ message: '验证码已发送' });
    } else {
        res.status(500).json({ message: '发送验证码失败' });
    }
});

// 验证验证码
router.post('/verify', (req, res) => {
    const { email, code } = req.body;
    const verification = verificationCodes.get(email);

    if (!verification) {
        return res.status(400).json({ message: '请先获取验证码' });
    }

    // 验证码5分钟内有效
    if (Date.now() - verification.timestamp > 5 * 60 * 1000) {
        verificationCodes.delete(email);
        return res.status(400).json({ message: '验证码已过期' });
    }

    // 最多允许3次验证尝试
    if (verification.attempts >= 3) {
        verificationCodes.delete(email);
        return res.status(400).json({ message: '验证次数过多' });
    }

    verification.attempts++;

    if (verification.code !== code) {
        return res.status(400).json({ message: '验证码错误' });
    }

    // 验证成功后删除验证码
    verificationCodes.delete(email);
    res.json({ valid: true });
});

module.exports = router; 