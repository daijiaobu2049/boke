// 将API地址改回原来的地址
const API_BASE_URL = 'https://boke-sand.vercel.app/api';

// 用户数据存储在 localStorage 中
const users = JSON.parse(localStorage.getItem('users')) || [];

// 当前登录用户
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// 获取验证码
let currentCaptchaId = null;

async function refreshCaptcha() {
    try {
        console.log('正在获取验证码...');
        const response = await fetch(`${API_BASE_URL}/captcha`);
        const data = await response.json();
        console.log('获取到验证码:', data);
        currentCaptchaId = data.id;
        const captchaElement = document.getElementById('captchaText');
        if (captchaElement) {
            captchaElement.textContent = data.code;
            console.log('验证码已显示');
        } else {
            console.error('找不到验证码显示元素');
        }
    } catch (error) {
        console.error('获取验证码失败:', error);
    }
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
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = this.username.value;
    const email = this.email.value;
    const password = this.password.value;
    const confirmPassword = this.confirmPassword.value;
    const captchaCode = this.captcha.value;

    // 验证验证码
    try {
        const response = await fetch(`${API_BASE_URL}/verify-captcha`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: currentCaptchaId,
                code: captchaCode
            })
        });

        const data = await response.json();
        if (!response.ok) {
            alert(data.message);
            refreshCaptcha();
            return;
        }

        // 验证码正确，继续注册流程
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
            password
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('注册成功！');
        bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
        this.reset();
        refreshCaptcha();
    } catch (error) {
        alert('验证失败，请重试');
        refreshCaptcha();
    }
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

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    refreshCaptcha();
    
    // 添加验证码点击事件
    const captchaElement = document.getElementById('captchaText');
    if (captchaElement) {
        captchaElement.addEventListener('click', refreshCaptcha);
    }
});