import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

function CreatePost() {
    const [formData, setFormData] = useState({
        title: '',
        content: ''
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/posts', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || '发布失败');
        }
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={3} style={{ padding: '2rem', marginTop: '2rem' }}>
                <Typography variant="h5" gutterBottom>写文章</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="标题"
                        margin="normal"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                    <TextField
                        fullWidth
                        label="内容"
                        multiline
                        rows={10}
                        margin="normal"
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{ marginTop: '1rem' }}
                    >
                        发布
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}

export default CreatePost; 