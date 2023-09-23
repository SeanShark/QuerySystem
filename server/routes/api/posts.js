const express = require("express");
const { Posts } = require("../../Model/MogonDB");

const router = express.Router();

//Get Posts
router.get("/getposts", async (req, res) => {
  console.log(req.body);
  //res.status(201).send(await Posts.find({}));
});
router.get("/", async (req, res) => {
  res.status(201).send(await Posts.find({}));

});

router.post("/", async (req, res) => {
  try {
    const { text } = req.body;
    const createdAt = new Date();
    
    // Validate input
    if (!text) {
      return res.status(400).json({
        status: "error",
        msg: "Missing required field: text"
      });
    }

    const newPost = new Posts({
      post: text,
      createdAt,
    });

    // Save new post to database
    await newPost.save();

    // Return success response
    return res.status(201).json({
      status: "success",
      msg: "Post created successfully."
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    return res.status(500).json({
      status: "error",
      msg: "Internal server error."
    });
  }
});



router.delete("/:id", async (req, res) => {
  try {
    await Todo.deleteOne({ _id: req.params.id });
    res.status(201).json({
      status: "success",
      msg: "任务已成功删除."
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      msg: "内部错误，请重试."
    });
  }
});

router.put("/", async (req, res) => {
  try {
    Posts.findOneAndUpdate({_id: req.body.post._id}, {post: req.body.post.newpost})
    .then((id) => {
      res.status(201).json({
        status: "success",
        msg: "Post has successfully updated!"
      })
    })
  } catch(err) {
    return res.status(401).json({
      status: "error",
      msg: err.message
    })
  }
})

module.exports = router;
