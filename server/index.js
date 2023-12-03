require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const corsOptions = {
  exposedHeaders: "Captcha"
};

//Middle ware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));

// Routes
// const API = require("./routes/api/posts");
const Users = require("./routes/api/user");
const TodoLists = require("./routes/api/todo");
const Query = require("./routes/api/query");
// app.use('/api/posts', API);
app.use('/api/user', Users);
app.use('/api/todo', TodoLists);
app.use('/api/query', Query);

if (process.env.NODE_ENV === 'prodution') {
  app.use(express.static(__dirname + '/public/'));
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
  
}

const port = process.env.PORT;
app.listen(port, () => console.log(`Server started on port ${port}...`));
 