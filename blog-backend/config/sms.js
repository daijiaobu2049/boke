const axios = require('axios');

// 这里使用阿里云短信服务示例，您需要替换为实际的短信服务商
async function sendSMS(phone, code) {
    // 开发环境直接返回验证码
    console.log(`验证码：${code} 已发送到手机：${phone}`);
    return true;
}

module.exports = { sendSMS }; 