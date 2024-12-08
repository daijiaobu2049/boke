// 用户数据存储在 localStorage 中
const users = JSON.parse(localStorage.getItem('users')) || [];

// 当前登录用户
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// 存储验证码
let verificationCodes = {};

// 生成验证码
function generateCode() {
    // 生成6位数字验证码
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += Math.floor(Math.random() * 10);
    }
    return code;
}

// 发送验证码
document.getElementById('sendCodeBtn').addEventListener('click', async function() {
    const email = document.querySelector('input[name="email"]').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email || !emailRegex.test(email)) {
        alert('请输入正确的邮箱地址');
        return;
    }

    try {
        // 发送验证码请求
        const response = await fetch('http://localhost:5000/api/verify/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();
        
        if (response.ok) {
            alert('验证码已发送到您的邮箱');
            
            // 禁用按钮60秒
            this.disabled = true;
            let countdown = 60;
            this.textContent = `${countdown}秒后重试`;
            
            const timer = setInterval(() => {
                countdown--;
                if (countdown <= 0) {
                    clearInterval(timer);
                    this.disabled = false;
                    this.textContent = '发送验证码';
                } else {
                    this.textContent = `${countdown}秒后重试`;
                }
            }, 1000);
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('发送验证码失败，请稍后重试');
    }
});

// 验证验证码
function verifyCode(email, code) {
    const verification = verificationCodes[email];
    if (!verification) {
        return { valid: false, message: '请先获取验证码' };
    }

    // 验证码5分钟内有效
    if (Date.now() - verification.timestamp > 5 * 60 * 1000) {
        delete verificationCodes[email];
        return { valid: false, message: '验证码已过期，请重新获取' };
    }

    // 最多允许3次验证尝试
    if (verification.attempts >= 3) {
        delete verificationCodes[email];
        return { valid: false, message: '验证次数过多，请重新获取验证码' };
    }

    verification.attempts++;

    if (verification.code !== code) {
        return { valid: false, message: '验证码错误' };
    }

    // 验证成功后删除验证码
    delete verificationCodes[email];
    return { valid: true };
}

// 更新导航栏显示
function updateNavbar() {
    const authButtons = document.getElementById('auth-buttons');
    if (currentUser) {
        authButtons.innerHTML = `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                    <i class="fas fa-user"></i> ${currentUser.username}
                </a>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#" onclick="logout()">
                        <i class="fas fa-sign-out-alt"></i> 退出
                    </a></li>
                </ul>
            </li>
        `;
    }
}

// 注册功能
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = this.username.value;
    const email = this.email.value;
    const password = this.password.value;
    const confirmPassword = this.confirmPassword.value;
    const verifyCode = this.verifyCode.value;

    // 验证验证码
    const verification = verifyCode(email, verifyCode);
    if (!verification.valid) {
        alert(verification.message);
        return;
    }

    if (password !== confirmPassword) {
        alert('两次输入的密码不一致！');
        return;
    }

    if (users.some(user => user.username === username)) {
        alert('用户名已存在！');
        return;
    }

    if (users.some(user => user.email === email)) {
        alert('邮箱已被注册！');
        return;
    }

    const newUser = {
        id: Date.now(),
        username,
        email,
        password // 实际应用中应该加密存储
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('注册成功！');
    bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
    this.reset();
});

// 登录功能
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = this.username.value;
    const password = this.password.value;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateNavbar();
        bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
        this.reset();
        alert('登录成功！');
        location.reload();
    } else {
        alert('用户名或密码错误！');
    }
});

// 退出登录
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    location.reload();
}

// 页面加载时检查登录状态
document.addEventListener('DOMContentLoaded', updateNavbar); 