// API 基础地址
const API_BASE_URL = 'https://boke-sand.vercel.app/api';

// 检查登录状态
function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = './login.html';
    }
}

// Markdown 编辑器实例
let editor;
// 当前编辑的文章 ID
let currentPostId = null;

// 初始化编辑器
document.addEventListener('DOMContentLoaded', () => {
    // 检查登录状态
    checkAuth();

    editor = new EasyMDE({
        element: document.getElementById('editor'),
        spellChecker: false,
        autosave: {
            enabled: true,
            delay: 1000,
            uniqueId: 'blogPost'
        }
    });

    // 加载文章列表
    loadPosts();

    // 添加导航事件监听
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            // TODO: 切换页面内容
        });
    });
});

// 加载文章列表
async function loadPosts() {
    try {
        const response = await fetch(`${API_BASE_URL}/posts`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        const posts = await response.json();
        
        const postsHtml = posts.map(post => `
            <tr>
                <td>${post.title}</td>
                <td>${post.category}</td>
                <td>${post.tags.join(', ')}</td>
                <td>${new Date(post.date).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-primary me-1" onclick="editPost(${post.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deletePost(${post.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
        document.getElementById('posts-list').innerHTML = postsHtml;
    } catch (error) {
        console.error('加载文章失败:', error);
        alert('加载文章失败');
    }
}

// 显示文章编辑模态框
function showPostModal(post = null) {
    currentPostId = post?.id || null;
    const form = document.getElementById('postForm');
    
    if (post) {
        form.title.value = post.title;
        form.category.value = post.category;
        form.tags.value = post.tags.join(',');
        editor.value(post.content);
    } else {
        form.reset();
        editor.value('');
    }
    
    new bootstrap.Modal(document.getElementById('postModal')).show();
}

// 保存文章
async function savePost() {
    const form = document.getElementById('postForm');
    const postData = {
        title: form.title.value,
        category: form.category.value,
        tags: form.tags.value.split(',').map(tag => tag.trim()),
        content: editor.value()
    };

    try {
        const url = currentPostId ? `${API_BASE_URL}/posts/${currentPostId}` : `${API_BASE_URL}/posts`;
        const method = currentPostId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: JSON.stringify(postData)
        });

        if (response.ok) {
            bootstrap.Modal.getInstance(document.getElementById('postModal')).hide();
            loadPosts();
        } else {
            alert('保存失败');
        }
    } catch (error) {
        console.error('保存文章失败:', error);
        alert('保存文章失败');
    }
}

// 编辑文章
async function editPost(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/${id}`);
        const post = await response.json();
        showPostModal(post);
    } catch (error) {
        console.error('加载文章失败:', error);
        alert('加载文章失败');
    }
}

// 删除文章
async function deletePost(id) {
    if (!confirm('确定要删除这篇文章吗？')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadPosts();
        } else {
            alert('删除失败');
        }
    } catch (error) {
        console.error('删除文章失败:', error);
        alert('删除文章失败');
    }
}

// 退出登录
function logout() {
    localStorage.removeItem('adminToken');
    window.location.href = './login.html';
} 