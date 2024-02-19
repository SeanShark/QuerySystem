import * as Database from "../models/queryModel.js";

const getQueryRusults = async (req, res, next) => {

  const { customer, field } = req.body.data;
  const type = req.body.type

  let keyword = req.body.data.keyword;
  // console.log('getQueryRusults',keyword, customer );

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

  const DB = Database[type];

  try {
    let results = new Object();

    const letter = keyword.charAt(0);
    const unicode = keyword.charCodeAt(0);

    if (letter === '!' || unicode === 65281) {
      keyword = keyword.replace(letter, "");
      results = await DB.find({
        $and: [{ customer: customer }, { [field]: { $not: new RegExp(keyword, "i") }}]
      }).select('-Buffer').sort({ updatedAt: "descending" });
    }
    else if (keyword === "全部" || keyword === "所有" || keyword.toUpperCase() === "ALL" ) {
      results = await DB.find({ customer: customer }).select('-Buffer')
        .sort({ updatedAt: "descending" });
    } 
    else if (keyword.toUpperCase() === "NULL" || keyword === "空的") {
      results = await DB.find({
        $and: [
          { customer: customer },
          { [field]: null },
        ],
      }).select('-Buffer').sort({ updatedAt: "descending" });
    } 
    else if ( field === '数量' ) {
      results = await DB.find({
        $and: [
          { customer: customer },
          { [field]: parseInt(keyword) },
        ],
      }).select('-Buffer').sort({ updatedAt: "descending" });
    } 
    else {
      results = await DB.find({
        $and: [
          { customer: customer },
          { [field]: { $regex: new RegExp(keyword, "i") } },
        ],
      }).select('-Buffer').sort({ updatedAt: "descending" });
    }

    res.status(201).send(results);
    // console.log('getQueryRusults',results);

  }
  catch (err) {
    res.status(401).json({
      status: "error",
      msg: err.message,
    });
  }
}

//IP
const newIp = async (req, res) => {
  const customer = req.body.data.customer;
  
  const MAC = req.body.data.MAC.toUpperCase();
  const ip = req.body.data.IP;
  let existsIP = await Database.IP.exists({
    $and: [{ customer: customer }, { IP: ip }],
  });
  let existsMAC = await Database.IP.exists({
    $and: [{ customer: customer }, { MAC: MAC }],
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
      customer: customer,
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
}

const updateIp = async (req, res) => {
  const customer = req.body.data.customer;
  const ip = req.body.data.IP;
  const mac = req.body.data.MAC.toUpperCase();
  const id = req.body.data._id;

  let existsIP = await Database.IP.exists({
    $and: [{ IP: ip }, { customer: customer }, { _id: { $ne: id } }],
  });
  let existsMAC = await Database.IP.exists({
    $and: [{ MAC: mac }, { customer: customer }, { _id: { $ne: id } }],
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
    const updateRecord = {
      IP: ip,
      MAC: mac,
      姓名: req.body.data.姓名,
      办公室: req.body.data.办公室,
      备注: req.body.data.备注,
      updatedAt: date,
    };
    Database.IP.findOneAndUpdate({ _id: id }, updateRecord)
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
}

//Printer
const newPrinter = async (req, res) => {
  const customer = req.body.data.customer;
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
      { customer: customer },
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
    customer: customer,
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
}

const updatePrinter = async (req, res) => { 
  const customer = req.body.data.customer;
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
      { customer: customer },
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
}

//Phone
const newPhone = async (req, res) => {
  const customer = req.body.data.customer;
  const cable = req.body.data.楼层线路.toUpperCase();
  const number = req.body.data.号码;
  const panel = req.body.data.面板号;
  const color = req.body.data.颜色对;
  const office = req.body.data.办公室;

  if (
    !customer ||
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
    $and: [{ customer: customer }, { 号码: number }],
  });

  let existsPanel = await Database.Phone.exists({
    $and: [{ customer: customer }, { 面板号: panel }],
  });

  let existsColor = await Database.Phone.exists({
    $and: [{ customer: customer }, { 楼层线路: cable }, { 颜色对: color }],
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
      customer: customer,
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
}

const updatePhone = async (req, res) => {
  const customer = req.body.data.customer;
  const cable = req.body.data.楼层线路.toUpperCase();
  const number = req.body.data.号码;
  const color = req.body.data.颜色对;
  const id = req.body.data._id;
  const panel = req.body.data.面板号;
  const office = req.body.data.办公室;

  if (
    !customer ||
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
    $and: [{ customer: customer }, { 号码: number }, { _id: { $ne: id } }],
  });
  let existsPanel = await Database.Phone.exists({
    $and: [{ customer: customer }, { 面板号: req.body.面板号 }, { _id: { $ne: id } }],
  });

  if (req.body.楼层线路) {
    let existsColor = await Database.Phone.exists({
      $and: [
        { customer: customer },
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
}

//Datacenter
const newDatacenter = async (req, res) => {
  let customer = req.body.data.customer;
  let ip = req.body.data.IP;
  let existsIP = await Database.Datacenter.exists({
    $and: [{ customer: customer }, { IP: ip }],
  });

  if (existsIP) {
    res.status(401).json({
      status: "ipError",
      msg: "IP地址已存在",
    });
  } else {
    const date = new Date().toLocaleString("zh-cn");
    const newRecord = new Database.Datacenter({
      customer: customer,
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
}

const updateDatacenter = async (req, res) => {
  const customer = req.body.data.customer;
  let ip = req.body.data.IP;
  let existsIP = await Database.Datacenter.exists({
    $and: [
      { customer: customer },
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
  const updateDatacenter = {
    名称: req.body.data.名称,
    IP: ip,
    用户名: req.body.data.用户名,
    密码: req.body.data.密码,
    备注: req.body.data.备注,
    updatedAt: date,
  };
  Database.Datacenter.findOneAndUpdate({ _id: req.body.data._id }, updateDatacenter)
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

//Surveillance
const newSurveillance = async (req, res) => {
  let customer = req.body.data.customer;
  let ip = req.body.data.IP;
  let existsIP = await Database.Surveillance.exists({
    $and: [{ customer: customer }, { IP: ip }],
  });

  if (existsIP) {
    return res.status(401).json({
      status: "ipError",
      msg: "IP地址已存在",
    });
  }
  const date = new Date().toLocaleString("zh-cn");
  const newRecord = new Database.Surveillance({
    customer: customer,
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
}

const updateSurveillance = async (req, res) => {
  let ip = req.body.data.IP;
  let existsIP = await Database.Surveillance.exists({
    $and: [
      { customer: req.body.data.customer },
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
    const updateSurveillance = {
      类型: req.body.data.类型,
      IP: ip,
      用户名: req.body.data.用户名,
      密码: req.body.data.密码,
      备注: req.body.data.备注,
      updatedAt: date,
    };
    Database.Surveillance.findOneAndUpdate({ _id: req.body.data._id }, updateSurveillance)
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
}

//Delete
const deleteRecord = async (req, res) => {
  const { type, id } = req.query;
  /*
  let DB = new Object();

  if (type === "机房") {
    DB = Database.Datacenter;
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
  */

  try {
    await Database[type].deleteOne({ _id: id });
    res.status(201).json({
      status: "success",
      msg: "记录已成功删除.",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      status: "error",
      msg: err.message,
    });
  }
}

export {
  newIp,
  newPhone,
  newPrinter,
  newDatacenter,
  newSurveillance,
  updateIp,
  updatePhone,
  updatePrinter,
  updateDatacenter,
  updateSurveillance,
  getQueryRusults,
  deleteRecord
}