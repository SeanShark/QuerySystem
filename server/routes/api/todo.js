const express = require("express");
const { Todo } = require("../../Model/MogonDB");

const router = express.Router();

router.post("/gettodolists", async (req, res) => {
  const owner = req.body.owner;
  if (!owner) {
    return res.status(400).json({
      status: "error",
      msg: "缺少关键内容",
    });
  }

  try {
    res.status(201).send(await Todo.find({ owner: owner }).sort({createdAt: 'descending'}));
    //res.status(201).send(await Todo.find({ owner: owner }).where('isDone').equals('false').sort({createdAt: 'descending'}));
  } catch (error) {
    // Handle errors
    return res.status(500).json({
      status: "error",
      msg: "内部错误，请重试."
    });
  }
});

router.post("/addtodo", async (req, res) => {
  // console.log(req.body);
  const owner = req.body.owner;
  const todo = req.body.todo;
  const color = req.body.color;
  const createdAt = req.body.createdAt;

  if (!owner || !todo || !createdAt) {
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
    // Handle errors
    return res.status(500).json({
      status: "error",
      msg: "内部错误，请重试."
    });
  }
});

router.delete("/:id", async (req, res) => {
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
});

router.put("/", async (req, res) => {
  const id = req.body.id;
  const field = req.body.field;
  const value = req.body.value;

  const filter = { _id: id }
  const update = { [field]: value }

  try {
    Todo.findOneAndUpdate(filter, update, { new: true })
    .then(() =>{
      res.status(201).json({
        status: "success",
        msg: '任务内容已更新!',
      })
    })
  } catch(err) {
    return res.status(401).json({
      status: "error",
      msg: err.message
    })
  }
});


module.exports = router;
