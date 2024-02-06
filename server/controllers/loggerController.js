import Logger from "../models/loggerModel.js";

const allLogger = async (req, res) => {

  const user = req.user.userInfo.email;
  try {
    let result = [];
    const monthOption = parseInt(req.body.month);
    if (req.body.month === 0) {
      result = await Logger.find({ user: user });
    } else if (monthOption === 1 || monthOption === 3 || monthOption === 6) {
      const MonthAgo = new Date();
      MonthAgo.setMonth(MonthAgo.getMonth() - monthOption);

      result = await Logger.find({
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
  
}

const newlogger = async (req, res) => {
  const { logger, date } = req.body;
  const user = req.user.userInfo.email;
  const createdAt = new Date().toLocaleString("zh-cn");

  const loggerExist = await Logger.exists({
    $and: [{ user: user }, { date: date }],
  });

  if (loggerExist) {
    const existingLogger = await Logger.findOne({ _id: loggerExist });
    const updatedLogger =
      existingLogger.logger + "<ul><li>" + logger + "</li></ul>";

    await Logger.updateOne(
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
      const newLogger = new Logger({
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
}

const updateLogger = async (req, res) => {
  const { _id, logger } = req.body;
  try {
    await Logger.findOneAndUpdate({ _id: _id }, { logger: logger })
      .then((e) => {
        if (e) {
          res.status(201).json({
            status: "success",
            msg: "日志成功修改.",
          });
        } else {
          res.status(404).json({
            status: "error",
            msg: "没有该日志记录.",
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
}

const deleteLogger = async (req, res) => {
  const id = req.query.id;
  try {
    await Logger.deleteOne({ _id: id })
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
}

export {
  allLogger,
  newlogger,
  updateLogger,
  deleteLogger
}