import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" style={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}>
          博客平台
        </Typography>
        {token ? (
          <>
            <Button color="inherit" component={Link} to="/create-post">
              写文章
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              退出
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              登录
            </Button>
            <Button color="inherit" component={Link} to="/register">
              注册
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 