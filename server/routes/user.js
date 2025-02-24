

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getUsers, updateUser, deleteUser, getMessages, sendMessage, getUserProfile } = require('../controllers/userController');

router.get('/', auth, getUsers);
router.put('/:id', auth, updateUser); // Update user profile
router.delete('/:id', auth, deleteUser); // Delete user profile
router.get('/messages/:userId', auth, getMessages);
router.post('/messages', auth, sendMessage);
router.get('/profile/:id', auth, getUserProfile); // Get user profile

module.exports = router;