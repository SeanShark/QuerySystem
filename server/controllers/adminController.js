import User from "../models/userModel.js";


/*
  User Privilege Settings
*/
const setUser = async (req, res) => {
  const { id, field, value } = req.body;

  try {
    const updateUser = await User.findOneAndUpdate({ _id: id }, { [field]: value });
    if (updateUser) {
      res.status(201).json({
        status: "success",
        msg: "权限成功修改.",
      });
    } else {
      res.status(404).json({
        status: "error",
        msg: "错误，请重试.",
      });
    }
  }
  catch(err) {
    console.log(err.message);
  }
}

/*
  SuperUser Delete User
*/
const deleteUser = async (req, res) => {
  
  const id = req.query.id;
  try {
    const targetId = await User.deleteOne({ _id: id })
    if (targetId) {
      res.status(201).json({
        status: "success",
        msg: "账户已成功删除.",
      });
    } else {
      res.status(401).json({
        status: "error",
        msg: "错误，请重试.",
      });
    }
  } catch (err) {
    res.status(401).json({
      status: "error",
      msg: err.message,
    });
  }
}

/*
  SuperUser Fetch All Users
*/
const allUser = async (req, res) => {
  try {
    const users = await User.find({}).select('-userInfo.password');
    res.status(201).send(users);
  }
  catch(err) {
    console.log(err.message);
  }
}

export { setUser, deleteUser, allUser }