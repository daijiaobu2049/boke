const nodemailer = require('nodemailer');

console.log('[SMTP] 创建邮件传输器...');
const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    debug: true,
    logger: true
});

// 发送验证码邮件
async function sendVerificationEmail(to, code) {
    try {
        console.log('[EMAIL] 开始发送邮件...', {
            to,
            code,
            timestamp: new Date().toISOString()
        });

        // 测试配置
        console.log('[EMAIL] 验证邮件配置...');
        await transporter.verify();
        console.log('[EMAIL] 邮件配置验证成功');

        const mailOptions = {
            from: `"博客验证" <${process.env.SMTP_USER}>`,
            to,
            subject: '注册验证码',
            html: `
                <div style="padding: 20px; background-color: #f8f9fa; border-radius: 10px;">
                    <h2 style="color: #2c3e50;">欢迎注册我的博客</h2>
                    <p>您的验证码是：</p>
                    <h1 style="color: #3498db; font-size: 30px; letter-spacing: 5px;">${code}</h1>
                    <p>验证码有效期为5分钟，请尽快完成注册。</p>
                </div>
            `
        };

        console.log('[EMAIL] 发送邮件中...', { to, timestamp: new Date().toISOString() });
        const info = await transporter.sendMail(mailOptions);
        console.log('[EMAIL] 邮件发送成功:', {
            messageId: info.messageId,
            response: info.response,
            timestamp: new Date().toISOString()
        });
        return true;
    } catch (error) {
        console.error('[EMAIL] 邮件发送失败:', {
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        return false;
    }
}

module.exports = { sendVerificationEmail }; 