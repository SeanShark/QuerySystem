import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const generateToken = (res, userId) => {
  // console.log('generateToken', userId);
  const token = jwt.sign({ userId }, process.env.jwtSecretKey, {
    expiresIn: '30d'
  });

  res.cookie('replyauthjwt', token, {
    httpOnly: true,
    secure: false,
    SameSite: 'Strict',
    maxAge: 30 * 24 * 60 * 60 * 1000
  })
}

export default generateToken;