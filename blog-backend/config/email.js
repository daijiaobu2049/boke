const nodemailer = require('nodemailer');

// 创建邮件传输器
const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// 发送验证码邮件
async function sendVerificationEmail(to, code) {
    try {
        console.log('开始发送邮件...');
        console.log('收件人:', to);
        console.log('验证码:', code);

        // 测试邮件配置
        await transporter.verify();
        console.log('邮件配置验证成功');

        const mailOptions = {
            from: `"博客验证" <${process.env.SMTP_USER}>`,
            to: to,
            subject: '注册验证码',
            html: `
                <div style="padding: 20px; background-color: #f8f9fa; border-radius: 10px;">
                    <h2 style="color: #2c3e50;">欢迎注册我的博客</h2>
                    <p>您的验证码是：</p>
                    <h1 style="color: #3498db; font-size: 30px; letter-spacing: 5px;">${code}</h1>
                    <p>验证码有效期为5分钟，请尽快完成注册。</p>
                    <p style="color: #7f8c8d; font-size: 12px; margin-top: 20px;">
                        如果这不是您的操作，请忽略此邮件。
                    </p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('邮件发送成功:', info.messageId);
        return true;
    } catch (error) {
        console.error('邮件发送失败，详细错误:', error);
        return false;
    }
}

module.exports = { sendVerificationEmail }; 