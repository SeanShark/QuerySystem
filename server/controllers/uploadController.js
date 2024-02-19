import multer from "multer";
import path from 'path';
import * as Database from "../models/queryModel.js";

// const storage = multer.diskStorage({
//   destination: './public/uploads',
//   filename: function(req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// })

const storage = multer.memoryStorage()

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb ) => {
    checkFileType(file, cb);
  }
}).single('myImage');

const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname) {
    return cb(null, true);
  } else {
    cb("错误, 只支持JPG、PNG格式");
  }
}

const uploadImage = async (req, res) => {
  upload(req, res, (err) => {
    const { id, type } = req.body
    // console.log('id:',id, 'type:',type);
    if (!id || !type) {
      return res.status(401).json({
        status: "error",
        msg: '上传参数错误',
      });
    }

    if (err) {
      return res.status(401).json(err);
    } else {
      try {
        const updateRecord = {
          'hasPic': true,
          'Buffer': req.file.buffer,
        };
        Database[type].findOneAndUpdate({ '_id': id }, updateRecord)
        .then((e) => {
          if (e) {
            return res.status(200).json({
              status: "success",
              msg: "图像上传成功."
            });
          } else {
            return res.status(401).json({
              status: "error",
              msg: e.message,
            });
          }
        })
      } catch (error) {
        return res.status(401).json({
          status: "error",
          msg: '保存图片失败',
        });
      }

    }
  })
}

const getImage = async (req, res) => {
  try {
    const { id, type } = req.query;
    // console.log('getImage_here', id, type);
    const imgBuffer = await Database[type].findById(id);
    if (imgBuffer.Buffer) {
      return res.status(200).json({
        status: "success",
        id: imgBuffer._id,
        buffer: imgBuffer.Buffer,
      });
    } else {
      return res.status(401).json({
        status: "error",
        msg: '没有图片信息',
      });
    }
  } catch(error) {
    console.log('getImage', error.message);
    return res.status(401).json({
      status: "error",
      msg: error.message,
    });
  }
}

const deleteImg = async (req, res) => {
  // console.log(req.body);
  try {
    const { id, type } = req.body;
    const updateRecord = {
      'hasPic': false,
      'Buffer': null,
    };
    const targetId = await Database[type].findOneAndUpdate({ '_id': id }, updateRecord);
    if (targetId) {
      return res.status(200).json({
        status: "success"
      });
    } else {
      return res.status(401).json({
        status: "error",
        msg: targetId.message,
      });
    }
  } catch (error) {
    return res.status(401).json({
      status: "error",
      msg: error.message,
    });
  }
}

export {
  uploadImage,
  getImage,
  deleteImg
}; 