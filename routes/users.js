const express = require('express');

const userRoutes = express.Router();

const {
  createUser,
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

userRoutes.post('/users', express.json(), createUser);
userRoutes.get('/users', express.json(), getUsers);
userRoutes.get('/users/:userId', express.json(), getUserById);
userRoutes.patch('/users/me', express.json(), updateUserProfile);
userRoutes.patch('/users/me/avatar', express.json(), updateUserAvatar);

module.exports = {
  userRoutes,
};
