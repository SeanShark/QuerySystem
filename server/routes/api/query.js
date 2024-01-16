const express = require("express");
const Database = require("../../Model/MogonDB");
const router = express.Router();
const validate = require("../../components/ValidateEmail.js");
const { query, validationResult, check, body } = require('express-validator');


router.get("/", [
  body("*.user").isEmail().withMessage("用户信息错误"),
  body("*.type").notEmpty().withMessage("类型不能为空")
  .isLength({ max: 10 }).withMessage("非法类型"),
  body("*.place").notEmpty().withMessage("地点不能为空")
  .isLength({ max: 10 }).withMessage("非法地点"),
  body("*.field").notEmpty().withMessage("字段不能为空")
  .isLength({ max: 10 }).withMessage("非法字段"),
  body("*.keyword").notEmpty().withMessage("关键字不能为空")
  .isLength({ max: 50 }).withMessage("关键字太多"),
], async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(401).json({ 
      status: "error",
      msg: result.array()[0].msg,
    });
  }

  const { user, type, place, field } = req.query.queryData;


  if (!await validate.validateUser(user)) {
    return res.status(401).json({
      status: "error",
      msg: "未授权用户",
    });
  }

  if (!await validate.placeControl(user, place)) {
    return res.status(401).json({
      status: "placeError",
      msg: "您没有权限访问该单位",
    });
  }

  let keyword = req.query.queryData.keyword;

  const forbiddenKeyword = ["1.2", "2.1", "1.1", "0.0"];

  let isForbidden = false;
  for (const forbidden of forbiddenKeyword) {
    if (keyword === forbidden) {
      isForbidden = true;
      break;
    }
  }
  if (isForbidden) {
    return res.status(401).json({
      status: "keywordError",
      msg: "关键字过于简单，请使用其他关键字",
    });
  }

  let DB = new Object();

  if (type === "机房") {
    if (!await validate.allowDatacenter(user)){
      return res.status(401).json({
        status: "typeError",
        msg: "您没有权限查看该数据",
      });
    };
    DB = Database.DataCenter;
  } else if (type === "终端") {
    if (!await validate.allowIP(user)){
      return res.status(401).json({
        status: "typeError",
        msg: "您没有权限查看该数据",
      });
    };
    DB = Database.IP;
    keyword = keyword.toUpperCase();
  } else if (type === "耗材") {
    if (!await validate.allowPrinter(user)){
      return res.status(401).json({
        status: "typeError",
        msg: "您没有权限查看该数据",
      });
    };
    DB = Database.Printer;
  } else if (type === "电话") {
    if (!await validate.allowPhone(user)){
      return res.status(401).json({
        status: "typeError",
        msg: "您没有权限查看该数据",
      });
    };
    DB = Database.Phone;
  } else if (type === "监控") {
    if (!await validate.allowsurveillance(user)){
      return res.status(401).json({
        status: "typeError",
        msg: "您没有权限查看该数据",
      });
    };
    DB = Database.Surveillance;
  } else {
    res.status(401).json({
      status: "error",
      msg: "错误搜索类型",
    });
    return;
  }
  // res.status(201).send(results);
  try {
    let results = new Object();

    const letter = keyword.charAt(0);
    const unicode = keyword.charCodeAt(0);
    if (letter === '!' || unicode === 65281) {
      keyword = keyword.replace(letter, "");
      results = await DB.find({
        $and: [{ Place: place }, { [field]: { $not: new RegExp(keyword, "i") }}]
      }).sort({ updatedAt: "descending" });
    }
    else if (keyword === "全部" || keyword === "所有" || keyword === "ALL") {
      results = await DB.find({ Place: place })
        .sort({ updatedAt: "descending" });
    } else if (keyword === "NULL" || keyword === "空的") {
      results = await DB.find({
        $and: [
          { Place: place },
          { [field]: null },
        ],
      }).sort({ updatedAt: "descending" });
    } else if ( field === '数量' ) {
      results = await DB.find({
        $and: [
          { Place: place },
          { [field]: parseInt(keyword) },
        ],
      }).sort({ updatedAt: "descending" });
    } else {
      results = await DB.find({
        $and: [
          { Place: place },
          { [field]: { $regex: new RegExp(keyword, "i") } },
        ],
      }).sort({ updatedAt: "descending" });
    }

    res.status(201).send(results);

  }
  catch (err) {
    res.status(401).json({
      status: "error",
      msg: err.message,
    });
  }
});

router.get("/logger", query("user").isEmail().withMessage("用户信息错误"), async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(401).json({ 
      status: "error",
      msg: result.array()[0].msg,
    });
  }

  const user = req.query.user;
  if (!await validate.validateUser(user)) {
    return res.status(401).json({
      status: "error",
      msg: "未授权用户",
    });
  }

  try {
    let result = [];
    const monthOption = parseInt(req.query.month);
    if (req.query.month === 0) {
      result = await Database.Logger.find({ user: user });
    } else if (monthOption === 1 || monthOption === 3 || monthOption === 6) {
      const MonthAgo = new Date();
      MonthAgo.setMonth(MonthAgo.getMonth() - monthOption);

      result = await Database.Logger.find({
        $and: [{ user: user }, { createdAt: { $gte: MonthAgo } }],
      });
    } else {
      return res.status(401).json({
        status: "error",
        msg: "错误搜索类型",
      });
    }

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.msg });
  }
});

router.post("/addlogger", async (req, res) => {
  const { user, logger, date } = req.body
  if (!await validate.validateUser(user)) {
    return res.status(401).json({
      status: "error",
      msg: "未授权用户",
    });
  }
  const createdAt = new Date().toLocaleString("zh-cn");

  const loggerExist = await Database.Logger.exists({
    $and: [{ user: user }, { date: date }],
  });

  if (loggerExist) {
    const existingLogger = await Database.Logger.findOne({ _id: loggerExist });
    const updatedLogger =
      existingLogger.logger + "<ul><li>" + logger + "</li></ul>";

    await Database.Logger.updateOne(
      { _id: loggerExist },
      { $set: { logger: updatedLogger } }
    )
    res.status(201).json({
      status: "success",
      msg: "日志成功增加.",
      logger: existingLogger.logger,
      id: loggerExist,
    });
    // console.log(result.modifiedCount, "document(s) updated");
  } else {
    try {
      const newLogger = new Database.Logger({
        user: user,
        date: date,
        logger: "<ul><li>" + logger + "</li></ul>",
        createdAt: createdAt,
      });

      // Save new post to database
      await newLogger
        .save()
        .then((e) => {
          res.status(201).json({
            status: "success",
            msg: "日志成功增加.",
            id: e._id.toString(),
          });
        })
        .catch((err) => {
          return res.status(401).json({
            status: "error",
            msg: err.message,
          });
        });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "error",
        msg: "Internal server error.",
      });
    }
  }
});

router.post("/editlogger", async (req, res) => {
  const { user, _id, logger } = req.body;
  if (!await validate.validateUser(user)) {
    return res.status(401).json({
      status: "error",
      msg: "未授权用户",
    });
  }

  try {
    await Database.Logger.findOneAndUpdate({ _id: _id }, { logger: logger })
      .then((e) => {
        if (e) {
          res.status(201).json({
            status: "success",
            msg: "日志成功修改.",
          });
        } else {
          res.status(404).json({
            status: "error",
            msg: "没有改日志记录.",
          });
        }
      })
      .catch((err) => {
        return res.status(401).json({
          status: "error",
          msg: err.message,
        });
      });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      msg: error.message,
    });
  }
});

router.post("/addip", async (req, res) => {
  const user = req.body.user;
  if (!await validate.validateUser(user)) {
    return res.status(401).json({
      status: "error",
      msg: "非法用户.",
    });
  }
  
  if (!await validate.addPrivilege(user)) {
    return res.status(401).json({
      status: "error",
      msg: "您没有该权限.",
    });
  }

  const place = req.body.data.Place;
  if (!await validate.placeControl(user, place)) {
    return res.status(401).json({
      status: "placeError",
      msg: "您没有权限访问该单位",
    });
  }

  const MAC = req.body.data.MAC.toUpperCase();
  const ip = req.body.data.IP;
  let existsIP = await Database.IP.exists({
    $and: [{ Place: place }, { IP: ip }],
  });
  let existsMAC = await Database.IP.exists({
    $and: [{ Place: place }, { MAC: MAC }],
  });

  if (existsIP) {
    res.status(401).json({
      status: "ipError",
      msg: "IP地址已存在",
    });
  } else if (existsMAC) {
    res.status(401).json({
      status: "macError",
      msg: "MAC地址已存在",
    });
  } else {
    const date = new Date().toLocaleString("zh-cn");
    const newRecord = new Database.IP({
      Place: place,
      IP: ip,
      MAC: MAC,
      姓名: req.body.data.姓名,
      办公室: req.body.data.办公室,
      备注: req.body.data.备注,
      updatedAt: date,
    });

    await newRecord
      .save()
      .then((e) => {
        res.status(201).json({
          status: "success",
          msg: "已成功增加记录",
          _id: e._id.toString(),
          updatedAt: date,
        });
      })
      .catch((e) => {
        // console.log(e.message);
        res.status(401).json({
          status: "error",
          msg: e.message,
        });
      });
  }
});

router.post("/adddatacenter", async (req, res) => {
  const user = req.body.user;
  if (!await validate.validateUser(user)) {
    return res.status(401).json({
      status: "error",
      msg: "非法用户.",
    });
  }
  
  if (!await validate.addPrivilege(user)) {
    return res.status(401).json({
      status: "error",
      msg: "您没有该权限.",
    });
  }

  let place = req.body.data.Place;
  if (!await validate.placeControl(user, place)) {
    return res.status(401).json({
      status: "placeError",
      msg: "您没有权限访问该单位",
    });
  }
  
  let ip = req.body.data.IP;
  let existsIP = await Database.DataCenter.exists({
    $and: [{ Place: place }, { IP: ip }],
  });

  if (existsIP) {
    res.status(401).json({
      status: "ipError",
      msg: "IP地址已存在",
    });
  } else {
    const date = new Date().toLocaleString("zh-cn");
    const newRecord = new Database.DataCenter({
      Place: place,
      IP: ip,
      名称: req.body.data.名称,
      用户名: req.body.data.用户名,
      密码: req.body.data.密码,
      备注: req.body.data.备注,
      updatedAt: date,
    });

    await newRecord
      .save()
      .then((e) => {
        res.status(201).json({
          status: "success",
          msg: "已成功增加记录",
          _id: e._id.toString(),
          updatedAt: date,
        });
      })
      .catch((e) => {
        // console.log(e.message);
        res.status(401).json({
          status: "error",
          msg: e.message,
        });
      });
  }
});

router.post("/addsurveillance", async (req, res) => {
  const user = req.body.user;
  if (!await validate.validateUser(user)) {
    return res.status(401).json({
      status: "error",
      msg: "非法用户.",
    });
  }
  
  if (!await validate.addPrivilege(user)) {
    return res.status(401).json({
      status: "error",
      msg: "您没有该权限.",
    });
  }

  let place = req.body.data.Place;
  if (!await validate.placeControl(user, place)) {
    return res.status(401).json({
      status: "placeError",
      msg: "您没有权限访问该单位",
    });
  }

  let ip = req.body.data.IP;
  let existsIP = await Database.Surveillance.exists({
    $and: [{ Place: place }, { IP: ip }],
  });

  if (existsIP) {
    return res.status(401).json({
      status: "ipError",
      msg: "IP地址已存在",
    });
  }
  const date = new Date().toLocaleString("zh-cn");
  const newRecord = new Database.Surveillance({
    Place: place,
    类型: req.body.data.类型,
    IP: ip,
    用户名: req.body.data.用户名,
    密码: req.body.data.密码,
    备注: req.body.data.备注,
    updatedAt: date,
  });

  await newRecord
    .save()
    .then((e) => {
      res.status(201).json({
        status: "success",
        msg: "已成功增加记录",
        _id: e._id.toString(),
        updatedAt: date,
      });
    })
    .catch((e) => {
      // console.log(e.message);
      res.status(401).json({
        status: "error",
        msg: e.message,
      });
    });
});

router.post("/addphone", async (req, res) => {
  const user = req.body.user;
  if (!await validate.validateUser(user)) {
    return res.status(401).json({
      status: "error",
      msg: "非法用户.",
    });
  }
  
  if (!await validate.addPrivilege(user)) {
    return res.status(401).json({
      status: "error",
      msg: "您没有该权限.",
    });
  }

  const place = req.body.data.Place;
  if (!await validate.placeControl(user, place)) {
    return res.status(401).json({
      status: "placeError",
      msg: "您没有权限访问该单位",
    });
  }

  const cable = req.body.data.楼层线路.toUpperCase();
  const number = req.body.data.号码;
  const panel = req.body.data.面板号;
  const color = req.body.data.颜色对;
  const office = req.body.data.办公室;

  if (
    !place ||
    !number ||
    !req.body.data.面板号 ||
    !req.body.data.办公室
  ) {
    res.status(401).json({
      status: "error",
      msg: "缺乏关键信息.",
    });
    return;
  }


  if (number < 10000000 || number > 100000000) {
    res.status(401).json({
      status: "numberError",
      msg: "请输入有效号码.",
    });
    return;
  }
  let existsNumber = await Database.Phone.exists({
    $and: [{ Place: place }, { 号码: number }],
  });

  let existsPanel = await Database.Phone.exists({
    $and: [{ Place: place }, { 面板号: panel }],
  });

  let existsColor = await Database.Phone.exists({
    $and: [{ Place: place }, { 楼层线路: cable }, { 颜色对: color }],
  });

  if (existsNumber) {
    res.status(401).json({
      status: "numberError",
      msg: "号码已存在",
    });
    return;
  } else if (existsPanel) {
    res.status(401).json({
      status: "panelError",
      msg: "面板号已使用",
    });
    return;
  } else if (existsColor) {
    res.status(401).json({
      status: "colorError",
      msg: "颜色对已使用",
    });
    return;
  } else {
    const date = new Date().toLocaleString("zh-cn");
    const newRecord = new Database.Phone({
      Place: place,
      号码: number,
      面板号: panel,
      楼层线路: cable,
      颜色对: color,
      办公室: office,
      updatedAt: date,
    });

    await newRecord
      .save()
      .then((e) => {
        res.status(201).json({
          status: "success",
          msg: "已成功增加记录",
          _id: e._id.toString(),
          updatedAt: date,
        });
      })
      .catch((e) => {
        res.status(401).json({
          status: "error",
          msg: e.message,
        });
      });
  }
});

router.post("/addprinter", async (req, res) => {
  const user = req.body.user;
  if (!await validate.validateUser(user)) {
    return res.status(401).json({
      status: "error",
      msg: "非法用户.",
    });
  }
  
  if (!await validate.addPrivilege(user)) {
    return res.status(401).json({
      status: "error",
      msg: "您没有该权限.",
    });
  }

  const place = req.body.data.Place;
  if (!await validate.placeControl(user, place)) {
    return res.status(401).json({
      status: "placeError",
      msg: "您没有权限访问该单位",
    });
  }

  const brand = req.body.data.品牌;
  const printer = req.body.data.打印机;
  const cartridge = req.body.data.硒鼓.toUpperCase();
  const color = req.body.data.颜色;
  const amount = req.body.data.数量 ? parseInt(req.body.data.数量) : 0;
  const office = req.body.data.办公室;

  if (
    !brand ||
    !printer ||
    !cartridge ||
    !color ||
    !office
  ) {
    return res.status(401).json({
      status: "error",
      msg: "缺乏关键信息",
    });
  }

  const date = new Date().toLocaleString("zh-cn");

  let existsColor = await Database.Printer.exists({
    $and: [
      { Place: place },
      { 品牌: brand },
      { 硒鼓: cartridge },
      { 颜色: color },
    ],
  });

  if (existsColor) {
    return res.status(401).json({
      status: "colorError",
      msg: "颜色已存在",
    });
  }
  const newRecord = new Database.Printer({
    Place: place,
    品牌: brand,
    打印机: printer,
    硒鼓: cartridge,
    颜色: color,
    数量: amount,
    办公室: office,
    updatedAt: date,
  });

  await newRecord
    .save()
    .then((e) => {
      res.status(201).json({
        status: "success",
        msg: "已成功增加记录",
        _id: e._id.toString(),
        updatedAt: date,
      });
    })
    .catch((e) => {
      res.status(401).json({
        status: "error",
        msg: e.message,
      });
    });
});

router.delete("/delete", async (req, res) => {
  const { type, id, user } = req.query;
  if (!await validate.validateUser(user)) {
    return res.status(401).json({
      status: "error",
      msg: "非法用户.",
    });
  }
  
  if (!await validate.deletePrivilege(user)) {
    return res.status(401).json({
      status: "error",
      msg: "您没有该权限.",
    });
  }

  let DB = new Object();

  if (type === "机房") {
    DB = Database.DataCenter;
  } else if (type === "终端") {
    DB = Database.IP;
  } else if (type === "耗材") {
    DB = Database.Printer;
  } else if (type === "电话") {
    DB = Database.Phone;
  } else if (type === "监控") {
    DB = Database.Surveillance;
  } else {
    res.status(401).json({
      status: "error",
      msg: "错误搜索类型",
    });
    return;
  }

  try {
    await DB.deleteOne({ _id: id })
      .then((e) => {
        res.status(201).json({
          status: "success",
          msg: "记录已成功删除.",
        });
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      status: "error",
      msg: err.message,
    });
  }
});

router.delete("/deletelogger", async (req, res) => {
  const user = req.query.user;
  if (!await validate.validateUser(user)) {
    return res.status(401).json({
      status: "error",
      msg: "未授权用户",
    });
  }

  const id = req.query.id;
  try {
    await Database.Logger.deleteOne({ _id: id })
      .then(() => {
        res.status(201).json({
          status: "success",
          msg: "日志已成功删除.",
        });
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err.message);
    res.status(401).json({
      status: "error",
      msg: err.message,
    });
  }
});

router.put("/editip", async (req, res) => {
  const user = req.body.user;
  if (!await validate.validateUser(user)) {
    return res.status(401).json({
      status: "error",
      msg: "非法用户.",
    });
  };
  
  if (!await validate.editPrivilege(user)) {
    return res.status(401).json({
      status: "error",
      msg: "您没有该权限.",
    });
  };

  const place = req.body.data.Place;
  if (!await validate.placeControl(user, place)) {
    return res.status(401).json({
      status: "placeError",
      msg: "您没有权限访问该单位",
    });
  }

  const ip = req.body.data.IP;
  const mac = req.body.data.MAC.toUpperCase();
  const id = req.body.data._id;

  let existsIP = await Database.IP.exists({
    $and: [{ IP: ip }, { Place: place }, { _id: { $ne: id } }],
  });
  let existsMAC = await Database.IP.exists({
    $and: [{ MAC: mac }, { Place: place }, { _id: { $ne: id } }],
  });
  if (existsIP) {
    res.status(401).json({
      status: "ipError",
      msg: "与现有IP地址冲突",
    });
    return;
  } else if (existsMAC) {
    res.status(401).json({
      status: "macError",
      msg: "与现有MAC地址冲突",
    });
    return;
  } else {
    const date = new Date().toLocaleString("zh-cn");
    const updateUser = {
      IP: ip,
      MAC: mac,
      姓名: req.body.data.姓名,
      办公室: req.body.data.办公室,
      备注: req.body.data.备注,
      updatedAt: date,
    };
    Database.IP.findOneAndUpdate({ _id: id }, updateUser)
      .then((e) => {
        if (e) {
          res.status(201).json({
            status: "success",
            msg: "记录已更新",
            updatedAt: date,
          });
        } else {
          return res.status(401).json({
            status: "error",
            msg: "没有该记录",
          });
        }
      })
      .catch((err) => {
        return res.status(401).json({
          status: "error",
          msg: err.message,
        });
      });
  }
});

router.put("/editphone", async (req, res) => {
  const user = req.body.user;
  if (!await validate.validateUser(user)) {
    return res.status(401).json({
      status: "error",
      msg: "非法用户.",
    });
  }
  
  if (!await validate.editPrivilege(user)) {
    return res.status(401).json({
      status: "error",
      msg: "您没有该权限.",
    });
  }

  const place = req.body.data.Place;
  if (!await validate.placeControl(user, place)) {
    return res.status(401).json({
      status: "placeError",
      msg: "您没有权限访问该单位",
    });
  }

  const cable = req.body.data.楼层线路.toUpperCase();
  const number = req.body.data.号码;
  const color = req.body.data.颜色对;
  const id = req.body.data._id;
  const panel = req.body.data.面板号;
  const office = req.body.data.办公室;

  if (
    !place ||
    !number ||
    !panel ||
    !office
  ) {
    res.status(401).json({
      status: "error",
      msg: "缺乏关键信息.",
    });
    return;
  }


  if (number < 10000000 || number > 100000000) {
    res.status(401).json({
      status: "numberError",
      msg: "请输入有效号码.",
    });
    return;
  }
  let existsPhone = await Database.Phone.exists({
    $and: [{ Place: place }, { 号码: number }, { _id: { $ne: id } }],
  });
  let existsPanel = await Database.Phone.exists({
    $and: [{ Place: place }, { 面板号: req.body.面板号 }, { _id: { $ne: id } }],
  });

  if (req.body.楼层线路) {
    let existsColor = await Database.Phone.exists({
      $and: [
        { Place: place },
        { 楼层线路: cable },
        { 颜色对: color },
        { _id: { $ne: id } },
      ],
    });
    if (existsColor) {
      res.status(401).json({
        status: "colorError",
        msg: "颜色对已使用",
      });
      return;
    }
  }

  if (existsPhone) {
    res.status(401).json({
      status: "numberError",
      msg: "号码已存在",
    });
    return;
  } else if (existsPanel) {
    res.status(401).json({
      status: "panelError",
      msg: "面板号已使用",
    });
    return;
  } else {
    const date = new Date().toLocaleString("zh-cn");
    const updatePhone = {
      号码: req.body.data.号码,
      面板号: req.body.data.面板号,
      楼层线路: req.body.data.楼层线路,
      颜色对: req.body.data.颜色对,
      办公室: req.body.data.办公室,
      updatedAt: date,
    };
    Database.Phone.findOneAndUpdate({ _id: req.body.data._id }, updatePhone)
      .then((e) => {
        if (e) {
          res.status(201).json({
            status: "success",
            msg: "记录已更新",
            updatedAt: date,
          });
        } else {
          return res.status(401).json({
            status: "error",
            msg: "没有该记录",
          });
        }
      })
      .catch((err) => {
        return res.status(401).json({
          status: "error",
          msg: err.message,
        });
      });
  }
});

router.put("/editprinter", async (req, res) => {
  const user = req.body.user;
  if (!await validate.validateUser(user)) {
    return res.status(401).json({
      status: "error",
      msg: "非法用户.",
    });
  }
  
  if (!await validate.editPrivilege(user)) {
    return res.status(401).json({
      status: "error",
      msg: "您没有该权限.",
    });
  }
  
  const place = req.body.data.Place;
  if (!await validate.placeControl(user, place)) {
    return res.status(401).json({
      status: "placeError",
      msg: "您没有权限访问该单位",
    });
  }

  const id = req.body.data._id;
  const brand = req.body.data.品牌;
  const printer = req.body.data.打印机;
  const cartridge = req.body.data.硒鼓.toUpperCase();
  const color = req.body.data.颜色;
  const amount = req.body.data.数量 ? parseInt(req.body.data.数量) : 0;
  // console.log(typeof amount); //number
  const office = req.body.data.办公室;
  if (
    !brand ||
    !printer ||
    !cartridge ||
    !color ||
    !office
  ) {
    return res.status(401).json({
      status: "error",
      msg: "缺乏关键信息",
    });
  }

  const date = new Date().toLocaleString("zh-cn");
  let existsColor = await Database.Printer.exists({
    $and: [
      { Place: place },
      { 硒鼓: cartridge },
      { 颜色: color },
      { _id: { $ne: id } },
    ],
  });

  if (existsColor) {
    return res.status(401).json({
      status: "colorError",
      msg: "颜色已存在",
    });
  }

  const updatePrinter = {
    品牌: brand,
    打印机: printer,
    硒鼓: cartridge,
    颜色: color,
    数量: amount,
    办公室: office,
    updatedAt: date,
  };
  Database.Printer.findOneAndUpdate({ _id: req.body.data._id }, updatePrinter)
    .then((e) => {
      if (e) {
        res.status(201).json({
          status: "success",
          msg: "记录已更新",
          updatedAt: date,
        });
      } else {
        return res.status(401).json({
          status: "error",
          msg: "没有该记录",
        });
      }
    })
    .catch((err) => {
      return res.status(401).json({
        status: "error",
        msg: err.message,
      });
    });
});

router.put("/editdatacenter", async (req, res) => {
  const user = req.body.user;
  if (!await validate.validateUser(user)) {
    return res.status(401).json({
      status: "error",
      msg: "非法用户.",
    });
  }
  
  if (!await validate.editPrivilege(user)) {
    return res.status(401).json({
      status: "error",
      msg: "您没有该权限.",
    });
  }

  const place = req.body.data.Place;
  if (!await validate.placeControl(user, place)) {
    return res.status(401).json({
      status: "placeError",
      msg: "您没有权限访问该单位",
    });
  }
  
  let ip = req.body.data.IP;
  let existsIP = await Database.DataCenter.exists({
    $and: [
      { Place: place },
      { IP: ip },
      { _id: { $ne: req.body.data._id } },
    ],
  });
  if (existsIP) {
    return res.status(401).json({
      status: "ipError",
      msg: "与现有IP地址冲突",
    });
  } 

  const date = new Date().toLocaleString("zh-cn");
  const updateDataCenter = {
    名称: req.body.data.名称,
    IP: ip,
    用户名: req.body.data.用户名,
    密码: req.body.data.密码,
    备注: req.body.data.备注,
    updatedAt: date,
  };
  Database.DataCenter.findOneAndUpdate({ _id: req.body.data._id }, updateDataCenter)
    .then((e) => {
      if (e) {
        res.status(201).json({
          status: "success",
          msg: "记录已更新",
          updatedAt: date,
        });
      } else {
        return res.status(401).json({
          status: "error",
          msg: "没有该记录",
        });
      }
    })
    .catch((err) => {
      return res.status(401).json({
        status: "error",
        msg: err.message,
      });
    });
  
});

router.put("/editsurveillance", async (req, res) => {
  const user = req.body.user;
  if (!await validate.validateUser(user)) {
    return res.status(401).json({
      status: "error",
      msg: "非法用户.",
    });
  }
  
  if (!await validate.editPrivilege(user)) {
    return res.status(401).json({
      status: "error",
      msg: "您没有该权限.",
    });
  }

  const place = req.body.data.Place;
  if (!await validate.placeControl(user, place)) {
    return res.status(401).json({
      status: "placeError",
      msg: "您没有权限访问该单位",
    });
  };

  let ip = req.body.data.IP;
  let existsIP = await Database.Surveillance.exists({
    $and: [
      { Place: req.body.data.Place },
      { IP: ip },
      { _id: { $ne: req.body.data._id } },
    ],
  });
  if (existsIP) {
    res.status(401).json({
      status: "ipError",
      msg: "与现有IP地址冲突",
    });
  } else {
    const date = new Date().toLocaleString("zh-cn");
    const updateDataCenter = {
      类型: req.body.data.类型,
      IP: ip,
      用户名: req.body.data.用户名,
      密码: req.body.data.密码,
      备注: req.body.data.备注,
      updatedAt: date,
    };
    Database.Surveillance.findOneAndUpdate({ _id: req.body.data._id }, updateDataCenter)
      .then((e) => {
        if (e) {
          res.status(201).json({
            status: "success",
            msg: "记录已更新",
            updatedAt: date,
          });
        } else {
          return res.status(401).json({
            status: "error",
            msg: e.message,
          });
        }
      })
      .catch((err) => {
        return res.status(401).json({
          status: "error",
          msg: err.message,
        });
      });
  }
});

module.exports = router;
