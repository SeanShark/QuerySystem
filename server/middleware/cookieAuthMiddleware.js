import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protect = (async (req, res, next) => {

  let token;
  token = req.cookies.replyauthjwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.jwtSecretKey);
      req.id = decoded.userId;
      req.user = await User.findById(decoded.userId).select('-userInfo.password');
      next();
    } catch (error) {
      res.status(401).json({
        title: "error",
        msg: "未授权用户。",
      });
    }
    
  } else {
    res.status(401).json({
      title: "error",
      msg: "请先登录。",
    });
  }
})

export { protect }