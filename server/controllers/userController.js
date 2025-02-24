


const User = require('../models/User');
const Message = require('../models/Message');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Check if the requesting user can delete their own profile (or add admin checks)
    if (user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this profile' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id }
      ]
    }).populate('sender', 'name').populate('receiver', 'name');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  const { content, receiver } = req.body;
  try {
    const message = new Message({
      sender: req.user.id,
      receiver,
      content
    });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// New method to get a single user's profile (for display/update)
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Ensure only the authenticated user or an admin can access this profile
    if (user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to view this profile' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};