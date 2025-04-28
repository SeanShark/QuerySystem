import Logger from "../models/loggerModel.js";

const allLogger = async (req, res) => {
  try {
    const { user, month } = req.body;
    const monthOption = parseInt(month);
    
    // Validate month option
    const validMonthOptions = [0, 1, 3, 6];
    if (!validMonthOptions.includes(monthOption)) {
      return res.status(400).json({
        status: "error",
        msg: "Invalid month parameter. Allowed values: 0, 1, 3, or 6",
      });
    }

    let query = { user };
    
    // Apply date filter if monthOption is not 0 (all time)
    if (monthOption !== 0) {
      const dateThreshold = new Date();
      dateThreshold.setMonth(dateThreshold.getMonth() - monthOption);
      query.createdAt = { $gte: dateThreshold };
    }

    const logs = await Logger.find(query).sort({ createdAt: -1 });
    /*
    res.status(200).json({
      status: "success",
      count: logs.length,
      data: logs
    });
    */
    res.status(201).json(logs);

  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({
      status: "error",
      msg: "Failed to retrieve logs",
      error: error.message
    });
  }
};

/*
const allLogger = async (req, res) => {

  //Set req.user value in cookieAuthMiddleware.js
  // const user = req.user.userInfo.email;

  const user = req.body.user;
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
*/



const newlogger = async (req, res) => {
  try {
    const { logger, date } = req.body;
    const user = req.user.userInfo.email;
    const createdAt = new Date().toLocaleString("zh-cn");

    // Check if logger exists
    const loggerExist = await Logger.findOne({
      $and: [{ user: user }, { date: date }],
    });

    if (loggerExist) {
      // Update existing logger
      const updatedLogger = loggerExist.logger + "<ul><li>" + logger + "</li></ul>";
      
      await Logger.updateOne(
        { _id: loggerExist._id },
        { $set: { logger: updatedLogger } }
      );
      
      return res.status(201).json({
        status: "success",
        msg: "日志成功增加.",
        logger: loggerExist.logger,
        id: loggerExist._id,
      });
    }

    // Create new logger
    const newLogger = new Logger({
      user: user,
      date: date,
      logger: "<ul><li>" + logger + "</li></ul>",
      createdAt: createdAt,
    });

    const savedLogger = await newLogger.save();
    
    res.status(201).json({
      status: "success",
      msg: "日志成功增加.",
      id: savedLogger._id.toString(),
    });

  } catch (error) {
    console.error(error);
    
    const statusCode = error.name === 'ValidationError' ? 400 : 500;
    res.status(statusCode).json({
      status: "error",
      msg: error.message || "Internal server error.",
    });
  }
};

/*
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
*/
const updateLogger = async (req, res) => {
  const { _id, logger } = req.body;
  
  try {
    const updatedLogger = await Logger.findOneAndUpdate(
      { _id: _id },
      { logger: logger }
    );

    if (!updatedLogger) {
      return res.status(404).json({
        status: "error",
        msg: "没有该日志记录.",
      });
    }

    res.status(201).json({
      status: "success",
      msg: "日志成功修改.",
    });

  } catch (error) {
    const statusCode = error.name === 'ValidationError' ? 400 : 500;
    res.status(statusCode).json({
      status: "error",
      msg: error.message,
    });
  }
};
/*
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
*/
const deleteLogger = async (req, res) => {
  const id = req.query.id;
  try {
    const targetId = await Logger.deleteOne({ _id: id })
    if (targetId) {
      return res.status(201).json({
        status: "success",
        msg: "日志已成功删除.",
      });
    } else {
      return res.status(401).json({
        status: "error",
        msg: "有错误发生.",
      });
    }
  } catch (err) {
    // console.log(err.message);
    return res.status(401).json({
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