import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Button, Box } from '@mui/material';
import axios from 'axios';

function PostDetail() {
    const [post, setPost] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/posts/${id}`);
                setPost(response.data);
            } catch (error) {
                console.error('获取文章失败:', error);
                navigate('/');
            }
        };
        fetchPost();
    }, [id, navigate]);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || '删除失败');
        }
    };

    if (!post) return null;

    return (
        <Container maxWidth="md" style={{ marginTop: '2rem' }}>
            <Paper elevation={3} style={{ padding: '2rem' }}>
                <Typography variant="h4" gutterBottom>
                    {post.title}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                    作者: {post.author.username}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    发布时间: {new Date(post.createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body1" style={{ marginTop: '2rem', whiteSpace: 'pre-wrap' }}>
                    {post.content}
                </Typography>
                {token && userId === post.author._id && (
                    <Box mt={3}>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDelete}
                            style={{ marginRight: '1rem' }}
                        >
                            删除文章
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate(`/edit-post/${id}`)}
                        >
                            编辑文章
                        </Button>
                    </Box>
                )}
            </Paper>
        </Container>
    );
}

export default PostDetail; 