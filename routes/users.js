const express = require('express');

const userRoutes = express.Router();

const {
  createUser,
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

userRoutes.post('/users', createUser);
userRoutes.get('/users', getUsers);
userRoutes.get('/users/:userId', getUserById);
userRoutes.patch('/users/me', updateUserProfile);
userRoutes.patch('/users/me/avatar', updateUserAvatar);

module.exports = {
  userRoutes,
};
