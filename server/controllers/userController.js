import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import mailTransporter from "../components/email.js";

/* 
  Login, Check user .
*/
const loginAuth = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ 'userInfo.email': email });
    if (!user) {
      return res.status(401).json({
        status: "nameError",
        msg: "没有此用户.",
      });
    } 
    if (user.userInfo.banned) {
      return res.status(401).json({
        status: "nameError",
        msg: "账户已禁用.",
      });
    }
  
    if (!await user.matchPassword(password)) {
      return res.status(401).json({
        status: "pwdError",
        msg: "密码错误.",
      });
    }
    // console.log(user._id.toString());
    const idToString = user._id.toString()
    generateToken(res, idToString);
    res.status(200).json({
      status: "success",
      msg: "验证成功"
    });
  }
  catch(err)  {
    res.status(401).json({
      status: "error",
      msg: err.message,
    });
  };
}

/*
  Verify user's cookie, asign User's infomation.
*/
const verifyUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.id);
  
    user.userInfo.lastLogin = new Date();
    await user.save();
    return res.status(200).json({ user: req.user });
    
  } catch (error) {
    console.log('verifyUser', error);
  }
}

/* 
  Register Step One: Check email
*/
const registerStepOne = async (req, res, next) => {
  const email = req.body.email;
  const activationCode = Math.floor(100000 + Math.random() * 900000);

  try {
    const user = await User.findOne({ 'userInfo.email': email });
    if(!user) {
      const newUser = new User({
        userInfo: {
          email: email,
          activationCode: activationCode,
        }
      });
      await newUser.save();
    } else if (user.userInfo.activationCode === null) {
      res.status(401).json({
        status: "error",
        msg: "邮箱已经被注册，请使用其他邮箱。",
      })
      return
    } else {
      user.userInfo.activationCode = activationCode
      user.save()
    }

    await mailTransporter
    .sendMail({
      from: "replytech@qq.com",
      to: email,
      subject: "注册验证码",
      //html: `<a href="http://10.168.3.3:5000/api/user/reset/${userEmail}/${VerificationCode}"><b>点击进入重置页面</b></a>`,
      html: `注册的验证码为：${activationCode}`,
    })
    .then((info) => {
      res.status(200).json({
        status: "success",
        msg: '已发送验证码到您邮箱，请查收.',
      });
    })
    .catch((err) => {
      res.status(401).json({
        status: "error",
        msg: "连接超时，请重试。",
      });
    });
  }
  catch (err) {
    res.status(401).json({
      status: "error",
      msg: err.message,
    });
  }
}

/* 
  Register Step Two: Verify activation code
*/
const registerStepTwo = async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await User.findOne({
      $and: [{ 'userInfo.email': email }, { 'userInfo.activationCode': code }],
    })
    if (user) {
      res.status(200).json({
        status: "success",
        msg: "验证通过，请设置密码.",
      });
    } else {
      return res.status(401).json({
        status: "error",
        msg: "邮箱或验证码错误，请检查后重试",
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
  Register Step Three: Set password
*/
const registerStepThree = async (req, res) => {
  const { email, code, password } = req.body;
  try {
    const user = await User.findOne({
      $and: [{ 'userInfo.email': email }, { 'userInfo.activationCode': code }],
    })
    if (!user) {
      return res.status(401).json({
        status: "error",
        msg: "信息验证错误，请重试",
      });
    }
    user.userInfo.password = password;
    user.userInfo.activationCode = null;
    await user.save();

    res.status(201).json({
      status: "success",
      msg: "密码设置成功，请前往登录页登录系统.",
    });
  }
  catch(err) {
    res.status(401).json({
      status: "error",
      msg: err.message,
    });
  };
}

/*
  Forgot password Step One: Check email
*/
const forgotStepOne = async (req, res, next) => {
  const userEmail = req.body.email;
  try {
    const user = await User.findOne({ 'userInfo.email': userEmail });
    if (!user) {
      return res.status(401).json({
        status: "error",
        msg: "用户不存在",
      });
    }

    const VerificationCode = Math.floor(100000 + Math.random() * 900000);
    user.userInfo.forgotCode = VerificationCode;
    await user.save();
    // console.log(user);

    await mailTransporter
      .sendMail({
        from: "replytech@qq.com",
        to: userEmail,
        subject: "重置验证码",
        text: "Hello world?",
        //html: `<a href="http://10.168.3.3:5000/api/user/reset/${userEmail}/${VerificationCode}"><b>点击进入重置页面</b></a>`,
        html: `此次重置密码的重置码为：${VerificationCode}`,
      })
      .then((info) => {
        res.status(200).json({
          status: "success",
          msg: "验证码已发到您邮箱，请查收",
        });
      })
      .catch((err) => {
        res.status(401).json({
          status: "error",
          msg: "发送邮件失败，请重试.",
        });
      });
  }
  catch(err)  {
    // console.log(err);
    res.status(401).json({
      status: "error",
      msg: err.message,
    });
  };
}

/*
  Forgot password Step Two: Verfify email and forgotCode code
*/
const forgotStepTwo = async (req, res) => {
  const { code, email } = req.body;
  try {
    const user = await User.findOne({
      $and: [
        { 'userInfo.email': email }, 
        { 'userInfo.forgotCode': code }
      ],
    });
    if (user) {
      res.status(200).json({
        status: "success",
        msg: "验证成功，请重新设置您的密码.",
      });
    } else {
      res.status(401).json({
        status: "error",
        msg: "验证码错误，请重试",
      });
    }
  } catch (err) {
    //if doesn't exist
    res.status(401).json({
      status: "error",
      msg: err.message,
    });
  }
}

/*
  Forgot password Step Three: Reset password
*/
const forgotStepThree = async (req, res) => {
  const { email, code, password } = req.body;
  try {
    const user = await User.findOne({
      $and: [
        { 'userInfo.email': email }, 
        { 'userInfo.forgotCode': code }
      ],
    });
    if (!user) {
      return res.status(401).json({
        status: "error",
        msg: "验证错误，请重试.",
      });
    } 
    user.userInfo.password = password;
    user.userInfo.forgotCode = "";
    await user.save()
      .then(() => {
        res.status(201).json({
          status: "success",
          msg: "密码重置成功，3秒后自动转到登录页.",
        });
      })
      .catch(err => console.log(err));
  }
  catch(err) {
    res.status(401).json({
      status: "error",
      msg: err.message,
    });
  };
}

/*
  Personal Information Settings
*/
const personalSetting = async (req, res) => {
  const user = await User.findById( req.id );

  user.userInfo.name = req.body.name;
  user.userInfo.gender = req.body.gender;
  user.userInfo.birth = req.body.birth;
  user.userInfo.phone = req.body.phone;

  await user.save()
    .then(() => {
      res.status(201).json({
        status: "success",
        msg: "资料设置成功",
      });
    })
    .catch(err => console.log(err));
}

/*
  Personal Password Change
*/
const changePassword = async (req, res, next) => {
  const { originPwd, newPwd } = req.body;
  try {
    const user = await User.findById(req.id);
    if (user.userInfo.banned) {
      return res.status(401).json({
        status: "error",
        msg: "账户已禁用.",
      });
    }
  
    if (!await user.matchPassword(originPwd)) {
      return res.status(401).json({
        status: "pwdError",
        msg: "密码错误.",
      });
    }

    user.userInfo.password = newPwd;
    await user.save()
      .then(() => {
        res.status(200).json({
          status: "success",
          msg: "密码更改成功"
        });
      })
      .catch(err => console.log(err));
  }
  catch(err)  {
    res.status(401).json({
      status: "error",
      msg: err.message,
    });
  };
}

/*
  Logger Settings
*/
const loggerSetting = async (req, res) => {
  const { monthRange, themeColor, eventColor} = req.body;
  try {
    const user = await User.findOne({ _id: req.id });
    user.loggerSetting.monthRange = monthRange;
    user.loggerSetting.themeColor = themeColor;
    user.loggerSetting.eventColor = eventColor;
  
    await user.save()
    .then(() => {
      res.status(201).json({
        status: "success",
        msg: "设置完毕.",
      });
    })
    .catch((err) => {
      res.status(401).json({
        status: "error",
        msg: err.message,
      });
    })
  }
  catch(err) {
    res.status(401).json({
      status: "error",
      msg: err.message,
    });
  };
}

const logoutUser = async (req, res) => {
  res.cookie('replyauthjwt', '', {
    httpOnly: true,
    SameSite: 'Strict',
    expires: new Date(0)
  });
  
  res.status(200).json({ 
    status: "success",
    msg: "用户注销.",
  });
}

export {
  loginAuth,
  verifyUser,
  registerStepOne,
  registerStepTwo,
  registerStepThree,
  forgotStepOne,
  forgotStepTwo,
  forgotStepThree,
  personalSetting,
  changePassword,
  loggerSetting,
  logoutUser,
}