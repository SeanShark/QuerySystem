import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const generateToken = (res, userId, remember) => {
  // console.log('generateToken', userId);
  const token = jwt.sign({ userId }, process.env.jwtSecretKey, {
    expiresIn: '30d'
  });

  const cookieOptions = {
    httpOnly: true,
    secure: false,
    SameSite: 'Strict'
  };

  if (remember) {
    cookieOptions.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
  }

  res.cookie('replyauthjwt', token, cookieOptions);

}

export default generateToken;