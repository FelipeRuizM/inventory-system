import jwt from 'jsonwebtoken';
import 'dotenv/config.js';
import User from '../models/user-schema.js';

const handleRefreshToken = async (req, res) => {
  const { cookies } = req;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  // Found user with refresh token 
  const found = await User.findOne({ where: { refreshtoken: refreshToken } });
  // if user not found
  if (!found) return res.sendStatus(403); //Forbidden 
  // evaluate jwt 
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    (err, decoded) => {
      if (err || found.username !== decoded.username) return res.sendStatus(403);
      // Generate new access token
      const accessToken = jwt.sign(
        {
          // Get from DB or from request body
          "username": found.username, // C-number or account
          "role": found.role
        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '5m' },
      );
      res.json({ user: found.username, role: found.role, accessToken })
    }
  );
}

export { handleRefreshToken };