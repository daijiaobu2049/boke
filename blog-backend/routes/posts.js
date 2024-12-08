const router = require('express').Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// 获取所有文章
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'username')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 创建文章
router.post('/', auth, async (req, res) => {
    try {
        const { title, content } = req.body;
        const post = new Post({
            title,
            content,
            author: req.user.id
        });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 获取单个文章
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username');
        if (!post) {
            return res.status(404).json({ message: '文章不存在' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 更新文章
router.put('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: '文章不存在' });
        }
        
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: '没有权限' });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 删除文章
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: '文章不存在' });
        }
        
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: '没有权限' });
        }

        await post.remove();
        res.json({ message: '文章已删除' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 