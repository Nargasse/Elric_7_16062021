const express = require('express');
const path = require('path');
const helmet = require('helmet');

const listPostsRoutes = require('./routes/listPosts');
const authRoutes = require ('./routes/auth');
const { allowedNodeEnvironmentFlags } = require('process');

const app = express();

app.use(helmet());

app.use((request, response, next) => { //On contrôle les autorisations CORS
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE', 'OPTIONS');
    next();
});

app.use(express.json());

//app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/posts', listPostsRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;