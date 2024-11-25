const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Make sure this line is present
//userController.js
// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
};

// Create a new user
exports.createUser = async (req, res) => {
    const { username, password, name, email, role } = req.body;
    try {
        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with hashed password
        const newUser = await User.create({
            username,
            password: hashedPassword,
            name,
            email,
            role
        });

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
};


// User login
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1h' }
        );

        // Include the role in the response
        res.status(200).json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
    const userId = req.user.id; // Get user ID from the authenticated request
    try {
        const user = await User.findByPk(userId, {
            attributes: ['id', 'username', 'name', 'email', 'role', 'created_at']
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error retrieving user profile:', error);
        res.status(500).json({ error: 'Failed to retrieve user profile' });
    }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
    const userId = req.user.id;
    const { name, email } = req.body;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user profile details
        user.name = name || user.name;
        user.email = email || user.email;

        await user.save();
        res.status(200).json(user);
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Failed to update user profile' });
    }
};

// Change user password
exports.changePassword = async (req, res) => {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if old password is correct
        const validPassword = await bcrypt.compare(oldPassword, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Incorrect old password' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save();
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Failed to change password' });
    }
};