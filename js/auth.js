// 用户数据存储在 localStorage 中
const users = JSON.parse(localStorage.getItem('users')) || [];

// 当前登录用户
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

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