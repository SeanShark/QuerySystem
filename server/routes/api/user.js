const express = require("express");
const { User } = require("../../Model/MogonDB");
const Database = require("../../Model/MogonDB");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const key = process.env.jwtSecretKey;
const router = express.Router();
const transporter = require("../../Mail/email");
const svgCaptcha = require('svg-captcha');
const validate = require("../../components/ValidateEmail.js");
const { query, validationResult, check, body } = require('express-validator');


router.get("/test", [
  body("user").notEmpty().withMessage("用户名不能为空"),
  body("user").isEmail().withMessage("非法邮箱账号"),
  body("post").isLength({ min: 10 }).withMessage("post too short.")
], async (req, res) => {
  const result = validationResult(req);
  console.log(result);
  if (result.isEmpty()) {
    // return res.send(`Hello, ${req.query.person}!`);
    return res.send(`Hello, ${req.body.user}!`);
  }
  res.status(401).send({ errors: result.array()[0].msg });
})

router.get("/captcha", async ( req, res) => {
  var captcha = svgCaptcha.create({
    size: 4,
    ignoreChars: '0o1ilIgqp',
    noise: 2,
    color: true,
    background: '#d6d6d6',
    height: 54,
    width: 140,
  });

  res.type('svg');
  res.set('Captcha', captcha.text);
  res.set("CharacterEncoding","UTF-8");
  res.set("ContentType","application/json");
	res.status(200).send(captcha);
})


/* 
  Register For Bootstrp
*/
router.post("/register", async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(6)
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    repeat_password: Joi.any().valid(Joi.ref("password")).required(),
  });

  const checkuser = schema.validate(req.body);

  if (checkuser.error) {
    res.status(400).json({
      status: "error",
      msg: checkuser.error.details[0].message,
    });
    return;
  }

  await Database.User.findOne({ email: req.body.email }).then(async (user) => {
    if (user) {
      res.status(400).json({
        status: "error",
        msg: "邮件已经被注册",
      });
      return;
    }

    const newUser = new User({
      name: req.body.email.match(/(.*)@(.*)/)[1],
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      createdAt: new Date(),
    });

    await newUser
      .save()
      .then(
        res.status(200).json({
          status: "success",
          msg: "用户注册成功",
        })
      )
      .catch((err) => console.log(err));
  });
});

/* 
  Register For Quasar
*/
//Step One: Check email and send register code, save code in db
router.post("/signup", async (req, res, next) => {

  const emailSchema = Joi.object({
    email: Joi.string().email().required(),
  });
  const emailCheck = emailSchema.validate(req.body);
  if (emailCheck.error) {
    res.status(400).json({
      status: "error",
      msg: emailCheck.error.details[0].message,
    });
    return;
  }

  const email = req.body.email;
  const activationCode = Math.floor(100000 + Math.random() * 900000);

  try {
    const user = await Database.User.findOne({ email: email });
    if(!user) {
      const newUser = new User({
        email: email,
        activationCode: activationCode,
      });
      await newUser.save();
    } else if (user.activationCode === null) {
      res.status(401).json({
        status: "error",
        msg: "邮箱已经被注册，请使用其他邮箱。",
      })
      return
    } else {
      user.activationCode = activationCode
      user.save()
    }

    await transporter
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
});

//Step two: Check email and register code, if ture, send 200 to client; if false, send 401
router.post("/verifysignup", async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await Database.User.findOne({
      $and: [{ email: email }, { activationCode: code }],
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
});

//Step three: Check email and register code, if ture ,save bcrypt password, set registerCode to null and send status 200
router.post("/setpassword", async (req, res) => {
  const { email, code, password } = req.body;
  try {
    const user = await Database.User.findOne({
      $and: [{ email: email }, { activationCode: code }],
    })
    if (!user) {
      return res.status(401).json({
        status: "error",
        msg: "信息验证错误，请重试",
      });
    }
    user.password = bcrypt.hashSync(password, 10);
    user.activationCode = null;
    user.createdAt = new Date().toLocaleString("zh-cn");;
    user.save();

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
});

/* 
  Login
*/
router.post("/login", async (req, res, next) => {
  try {
    const user = await Database.User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({
        status: "nameError",
        msg: "没有此用户.",
      });
    } 
    if (user.banned) {
      return res.status(401).json({
        status: "nameError",
        msg: "账户已禁用.",
      });
    }
  
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json({
        status: "pwdError",
        msg: "密码错误.",
      });
    }
  
    const token = jwt.sign({ userID: user._id }, key);
    res.status(200).json({
      status: "success",
      msg: "验证成功",
      token: token,
    });
  }
  catch(err)  {
    res.status(401).json({
      status: "error",
      msg: err.message,
    });
  };
});

/*
  Verify user
*/

router.get("/verifyuser", async (req, res, next) => {
  let token = req.headers.token;

  jwt.verify(token, key, async (err, decoded) => {
    if (err)
      return res.status(401).json({
        title: "error",
        msg: "未授权用户",
      });
      try {
        const user = await Database.User.findOne({ _id: decoded.userID })
        if(!user) {
          return res.status(401).json({
            title: "error",
            msg: "未授权用户",
          });
        }
        user.lastLogin = new Date();
        user.save();

        return res.status(200).json({
          user: {
            email: user.email,
            name: user.name,
            phone: user.phone,
            gender: user.gender,
            birth: user.birth,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
            loggerSetting: user.loggerSetting,
            userPrivilege: user.userPrivilege,
          },
        });
      }
      catch(err) {
        res.status(401).json({
          status: "error",
          msg: err.message,
        });
      };
  });
});

/*
  Change password
*/
router.post("/changepwd", [
    body("user").isEmail().withMessage("邮箱账号有误"),
    body("newPwd").notEmpty().withMessage("邮箱账号有误")
      .isLength({ min: 8, max: 30 }).withMessage("密码长度不符合要求")
  ], async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(401).json({
        status: "error",
        msg: result.array()[0].msg,
      });
    }
    
    try {
      
      const user = await Database.User.findOne({ email: req.body.user });
      if (!user) {
        return res.status(401).json({
          status: "error",
          msg: "没有此用户.",
        });
      } 
      if (user.banned) {
        return res.status(401).json({
          status: "error",
          msg: "账户已禁用.",
        });
      }
    
      if (!bcrypt.compareSync(req.body.originPwd, user.password)) {
        return res.status(401).json({
          status: "pwdError",
          msg: "密码错误.",
        });
      }

      user.password = bcrypt.hashSync(req.body.newPwd, 10);
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
});

/*
  Forgot password
*/

//Step One: Check email and send forgot code via email, save code in db
router.post("/forgot", async (req, res, next) => {
  const userEmail = req.body.email;
  try {
    const user = await Database.User.findOne({ email: userEmail });
    if (!user) {
      return res.status(401).json({
        status: "error",
        msg: "用户不存在",
      });
    }

    const VerificationCode = Math.floor(100000 + Math.random() * 900000);
    user.forgotCode = VerificationCode;
    user.save();
    // console.log(user);

    await transporter
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
});

//Step two: Verfify email and forgotCode code, if ture, send 200 to client; if false, send 401
router.post("/verifyforgotcode", async (req, res) => {
  const { code, email } = req.body;
  try {
    const user = await Database.User.findOne({
      $and: [{ email: email }, { forgotCode: code }],
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
});

//Step three: Verify email and forgot code, if ture ,save bcrypt new password, delete forgot code and send status 200
router.post("/resetpassword", async (req, res) => {
  const { email, code, password } = req.body;
  try {
    const user = await Database.User.findOne({
      $and: [{ email: email }, { forgotCode: code }],
    });
    if (!user) {
      return res.status(401).json({
        status: "error",
        msg: "验证错误，请重试.",
      });
    } 
    // if (bcrypt.compareSync(password, user.password)) {
    //   return res.status(401).json({
    //     status: "error",
    //     msg: "密码与前密码一致.",
    //   });
    // }
    user.password = bcrypt.hashSync(password, 10);
    user.forgotCode = "";
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
});

/*
  Logger Settings
*/
router.post("/loggersetting", async (req, res) => {
  const { user, monthRange, themeColor, eventColor} = req.body;
  if (!await validate.validateUser(user)) {
    return res.status(401).json({
      status: "error",
      msg: "未授权用户",
    });
  }
  try {
    const userEmail = await Database.User.findOne({ email: user });
    userEmail.loggerSetting.monthRange = monthRange;
    userEmail.loggerSetting.themeColor = themeColor;
    userEmail.loggerSetting.eventColor = eventColor;
  
    await userEmail.save()
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
});
/*
  SuperUser Fetch All Users
*/
router.post("/alluser",async (req, res) => {
  const user = req.body.user;
  if (!await validate.validateUser(user)) {
    return res.status(401).json({
      status: "error",
      msg: "未授权用户",
    });
  }

  const isSuperUser = await Database.User.exists({
    $and: [{ 'email': user }, { 'userPrivilege.superUser': 'true' }],
  });

  if (!isSuperUser) {
    return res.status(401).json({
      status: "error",
      msg: "非法用户",
    });
  }

  try {
    const users = await Database.User.find({});
    res.status(201).send(users);
  }
  catch(err) {
    console.log(err.message);
  }
});


/*
  User Privilege Settings
*/
router.post("/setuser",async (req, res) => {
  const { id, field, value, user } = req.body;


  if (!await validate.validateUser(user)) {
    return res.status(401).json({
      status: "error",
      msg: "未授权用户",
    });
  }

  const isSuperUser = await Database.User.exists({
    $and: [{ 'email': user }, { 'userPrivilege.superUser': 'true' }],
  });

  if (!isSuperUser) {
    return res.status(401).json({
      status: "error",
      msg: "非法用户",
    });
  }

  if ( id === '65007b62e5a12afd583d0304' && field === 'userPrivilege.superUser') {
    return res.status(401).json({
      status: "error",
      msg: "根管理员的管理权限不能更改",
    });
  }

  try {
    const updateUser = await Database.User.findOneAndUpdate({ _id: id }, { [field]: value });
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
});

/*
  Personal Information Settings
*/
router.post("/personal", async (req, res) => {
  const user = await Database.User.findOne({ email: req.body.user });
  if (!user) {
    return res.status(401).json({
      status: "error",
      msg: "用户不存在.",
    });
  }
  user.name = req.body.name;
  user.gender = req.body.gender;
  user.birth = req.body.birth;
  user.phone = req.body.phone;
  await user.save()
    .then(() => {
      res.status(201).json({
        status: "success",
        msg: "资料设置成功",
      });
    })
    .catch(err => console.log(err));

})

router.delete("/deleteuser", async (req, res) => {
  const user = req.query.user;
  if (!await validate.validateUser(user)) {
    return res.status(401).json({
      status: "error",
      msg: "未授权用户",
    });
  }

  const id = req.query.id;
  try {
    const targetId = await Database.User.deleteOne({ _id: id })
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
});

module.exports = router;
