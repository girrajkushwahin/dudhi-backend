const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const adminAuthenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) return res.status(401).json({ success: false, error: 'Authorization Required' })

        const token = authHeader.split(" ")[1];
        const verification = jwt.verify(token, process.env.SECRET_KEY);

        const rootUser = await User.findOne({ _id: verification._id });
        if (!rootUser) throw new Error('User not found');

        if (rootUser.role === 1) {
            req.token = token;
            req.rootUser = rootUser;
            next();
        }

    } catch (err) {
        res.status(401).send('Unauthorized: Invalid user');
    }
}

module.exports = adminAuthenticate;