import Todo from "../models/todoModel.js";

const getTodolists = async (req, res) => {
  // console.log(req.cookies.replyauthjwt);
  const owner = req.user.userInfo.email;

  try {
    res.status(201).send(await Todo.find({ owner: owner }).sort({createdAt: 'descending'}));
    //res.status(201).send(await Database.Todo.find({ owner: owner }).where('isDone').equals('false').sort({createdAt: 'descending'}));
  } catch (error) {
    // Handle errors
    console.log(error);
    return res.status(500).json({
      status: "error",
      msg: "内部错误，请重试.10023"
    });
  }
}

const newTodo = async (req, res) => {
  const owner = req.user.userInfo.email;
  const todo = req.body.todo;
  const color = req.body.color;
  const createdAt = req.body.createdAt;

  if ( !todo || !createdAt) {
    return res.status(400).json({
      status: "error",
      msg: "缺少关键内容",
    });
  }

  try {
    const newTodo = new Todo({
      owner: owner,
      todo: todo,
      color: color,
      createdAt: createdAt
    });

    // Save new post to database
    await newTodo.save().then(() => {
      return res.status(201).json({
        status: "success",
        msg: "成功增加记录."
      });
    })

  } catch (error) {
    console.log(error);
    // Handle errors
    return res.status(500).json({
      status: "error",
      msg: "内部错误，请重试."
    });
  }
}

const deleteTodo = async (req, res) => {
  try {
    await Todo.deleteOne({ _id: req.params.id }).then(() => {
      res.status(201).json({
        status: "success",
        msg: "记录成功删除."
      });
    })
  } catch (err) {
    res.status(500).json({
      status: "error",
      msg: "错误，请重试."
    });
  }
}

const updateTodo = async (req, res) => {
  const id = req.body.id;
  const field = req.body.field;
  const value = req.body.value;
  const createdAt = req.body.createdAt;

  const filter = { _id: id }
  try {
    const updated = await Todo.findOneAndUpdate(filter, { "$set": { [field]: value, "createdAt": createdAt }})
    if (updated) {
      res.status(201).json({
        status: "success",
        msg: '任务内容已更新!',
      })
    } else {
      res.status(404).json({
        status: "error",
        msg: "错误，请重试.",
      });
    }
  } catch(err) {
    return res.status(401).json({
      status: "error",
      msg: err.message
    })
  }
}

export {
  getTodolists,
  newTodo,
  deleteTodo,
  updateTodo
}