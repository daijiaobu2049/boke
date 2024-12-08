// 个人信息配置
const personalInfo = {
    name: "我的博客",
    title: "开发者",
    bio: "热爱编程，记录生活",
    social: {
        github: "https://github.com/daijiaobu2049",
        bilibili: "https://space.bilibili.com/471319710"
    },
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=John&backgroundColor=b6e3f4&hair=short02&eyes=variant12&mouth=variant26"
};

// 更新个人信息
function updatePersonalInfo() {
    document.querySelector('.card-title').textContent = personalInfo.name;
    document.querySelector('.card-text').textContent = personalInfo.bio;
    document.querySelector('.avatar').src = personalInfo.avatar;
    
    // 更新社交链接
    const socialLinksHtml = `
        <a href="${personalInfo.social.github}" target="_blank" class="btn btn-outline-dark btn-sm">
            <i class="fab fa-github"></i> GitHub
        </a>
        <a href="${personalInfo.social.bilibili}" target="_blank" class="btn btn-outline-danger btn-sm">
            <i class="fab fa-bilibili"></i> 哔哩哔哩
        </a>
    `;
    document.querySelector('.social-links').innerHTML = socialLinksHtml;
}

// 文章数据
const posts = [
    {
        title: '探索现代 Web 开发技术',
        date: '2024-03-08',
        summary: '现代 Web 开发技术日新月异，本文将探讨最新的前端开发趋势和技术栈...',
        tags: ['技术', '前端', 'Web开发'],
        content: 'posts/web-dev.html'
    },
    {
        title: '程序员的日常生活',
        date: '2024-03-07',
        summary: '作为一名程序员，除了编码还有很多有趣的事情要分享...',
        tags: ['生活', '随笔'],
        content: 'posts/daily-life.html'
    },
    {
        title: '学习笔记：JavaScript 高级特性',
        date: '2024-03-06',
        summary: '深入理解 JavaScript 的高级特性，包括闭包、原型链、异步编程等...',
        tags: ['技术', 'JavaScript'],
        content: 'posts/js-advanced.html'
    }
];

// 加载文章列表
function loadPosts() {
    const postsContainer = document.getElementById('posts-container');
    
    posts.forEach(post => {
        const tagsHtml = post.tags ? post.tags.map(tag => 
            `<span class="badge bg-secondary me-1">${tag}</span>`
        ).join('') : '';

        const postElement = `
            <div class="card post-card animate__animated animate__fadeInUp">
                <div class="card-body">
                    <h2 class="card-title">${post.title}</h2>
                    <div class="post-meta mb-3">
                        <i class="far fa-calendar-alt"></i> ${post.date}
                        <span class="ms-3">${tagsHtml}</span>
                    </div>
                    <p class="card-text">${post.summary}</p>
                    <a href="${post.content}" class="btn btn-primary">
                        阅读更多 <i class="fas fa-arrow-right ms-1"></i>
                    </a>
                </div>
            </div>
        `;
        postsContainer.innerHTML += postElement;
    });
}

// 检查登录状态
function checkLogin() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        // 如果未登录，隐藏内容并显示登录提示
        document.querySelector('.hero-carousel').style.display = 'none';
        document.querySelector('main').innerHTML = `
            <div class="container text-center py-5">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h2 class="mb-4">请先登录</h2>
                        <p class="mb-4">登录后即可查看博客内容</p>
                        <button class="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#loginModal">
                            <i class="fas fa-sign-in-alt"></i> 登录
                        </button>
                        <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#registerModal">
                            <i class="fas fa-user-plus"></i> 注册
                        </button>
                    </div>
                </div>
            </div>
        `;
        return false;
    }
    return true;
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    if (checkLogin()) {
        loadPosts();
        updatePersonalInfo();
    }
});

// 添加滚动动画
window.addEventListener('scroll', () => {
    const cards = document.querySelectorAll('.post-card');
    cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        if (cardTop < window.innerHeight - 100) {
            card.classList.add('animate__fadeInUp');
        }
    });
}); 