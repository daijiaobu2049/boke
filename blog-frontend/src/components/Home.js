import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, Button, CardActions } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

function Home() {
    const [posts, setPosts] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${config.apiUrl}/posts`);
                setPosts(response.data);
            } catch (error) {
                console.error('获取文章失败:', error);
            }
        };
        fetchPosts();
    }, []);

    return (
        <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
            {token && (
                <Button
                    component={Link}
                    to="/create-post"
                    variant="contained"
                    color="primary"
                    style={{ marginBottom: '2rem' }}
                >
                    写文章
                </Button>
            )}
            <Grid container spacing={3}>
                {posts.map(post => (
                    <Grid item xs={12} sm={6} md={4} key={post._id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {post.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    作者: {post.author.username}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    发布时间: {new Date(post.createdAt).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2" style={{ marginTop: '1rem' }}>
                                    {post.content.substring(0, 100)}...
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button 
                                    size="small" 
                                    color="primary" 
                                    component={Link} 
                                    to={`/post/${post._id}`}
                                >
                                    阅读更多
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default Home; 