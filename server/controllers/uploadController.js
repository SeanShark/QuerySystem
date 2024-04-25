import multer from "multer";
import path from "path";
import * as Database from "../models/queryModel.js";
import fs from "node:fs/promises";
import os from "os";

const storageMongodb = multer.memoryStorage();

const uploadMongodb = multer({
  storage: storageMongodb,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("myImage");

const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("错误, 只支持JPG、PNG格式");
  }
};

const uploadImageMongodb = async (req, res) => {
  uploadMongodb(req, res, (err) => {
    const { id, type } = req.body;
    // console.log('id:',id, 'type:',type);
    if (!id || !type) {
      return res.status(401).json({
        status: "error",
        msg: "上传参数错误",
      });
    }

    if (err) {
      return res.status(401).json(err);
    } else {
      try {
        const updateRecord = {
          hasPic: true,
          Buffer: req.file.buffer,
        };
        Database[type].findOneAndUpdate({ _id: id }, updateRecord).then((e) => {
          if (e) {
            return res.status(200).json({
              status: "success",
              msg: "图像上传成功.",
            });
          } else {
            return res.status(401).json({
              status: "error",
              msg: e.message,
            });
          }
        });
      } catch (error) {
        return res.status(401).json({
          status: "error",
          msg: "保存图片失败",
        });
      }
    }
  });
};
const __dirname = path.resolve();
const storageHardDisk = multer.diskStorage({
  // destination: './server/public/queryuploads',
  destination: path.resolve(__dirname, "server/public/queryuploads"),
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        file.originalname +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

const uploadHardDish = multer({
  storage: storageHardDisk,
  limits: { fileSize: 30000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).array("myImage", 5);

// const localPath = './server/public/queryuploads/';

const uploadtest = async (req, res) => {
  uploadHardDish(req, res, async (err) => {
    console.log(req.files);
    res.status(201).send();
  })
}


const uploadHardDisk = async (req, res) => {
  uploadHardDish(req, res, async (err) => {
    const { id, type } = req.body;
    if (!id || !type) {
      return res.status(401).json({
        status: "error",
        msg: "上传参数错误",
      });
    }
    if (err) {
      //err.code === 'LIMIT_UNEXPECTED_FILE'; exceeded number of array.
      return res.status(401).json({
        status: "error",
        msg: err,
      });
    } else {
      const item = await Database[type].findById(id);
      // const localPath = './server/public/queryuploads/';
      const uploadedFilesArray = req.files;
      const uploadedNamesArray = [];

      await uploadedFilesArray.forEach((element) => {
        uploadedNamesArray.push(element.filename);
      });

      const deleteUploadFiles = async () => {
        uploadedNamesArray.forEach(async (element) => {
          await fs.unlink(
            path.resolve(
            __dirname,
            "quasar",
            "public",
            "queryuploads",
            element
          ), (err) => {
            if (err) {
              console.log("deleteImgHardDisk: No such File.");
            }
          });
        });
      };

      if (item.picNames.length > 0) {
        const itemNamesArray = item.picNames;

        if (itemNamesArray.length >= 5) {
          await deleteUploadFiles();
          return res.status(401).json({
            status: "error",
            msg: "最多只能保存三张照片",
          });
        } else if (itemNamesArray.length + uploadedNamesArray.length > 5) {
          await deleteUploadFiles();
          return res.status(401).json({
            status: "error",
            msg: `最多只能保存三张照片，现有${itemNamesArray.length}张`,
          });
        } else {
          item.picNames = itemNamesArray.concat(uploadedNamesArray);
          await item.save();
          if (os.cpus()[0].model === "12th Gen Intel(R) Core(TM) i7-12700F") {
            uploadedNamesArray.forEach(async (element) => {
              try {
                await fs.copyFile(
                  path.resolve(
                    __dirname,
                    "server",
                    "public",
                    "queryuploads",
                    element
                  ),
                  path.resolve(
                    __dirname,
                    "quasar",
                    "public",
                    "queryuploads",
                    element
                  ),
                  fs.constants.COPYFILE_EXCL
                );
              } catch (error) {
                return res.status(401).json(error);
              }
            });
          }
        }
      } else {
        item.picNames = uploadedNamesArray;
        await item.save();
        if (os.cpus()[0].model === "12th Gen Intel(R) Core(TM) i7-12700F") {
          item.picNames.forEach(async (element) => {
            try {
              await fs.copyFile(
                path.resolve(
                  __dirname,
                  "server",
                  "public",
                  "queryuploads",
                  element
                ),
                path.resolve(
                  __dirname,
                  "quasar",
                  "public",
                  "queryuploads",
                  element
                ),
                fs.constants.COPYFILE_EXCL
              );
            } catch (error) {
              console.log(error);
            }
          });
        }
      }

      res.status(200).json({
        status: "success",
        picNames: item.picNames,
      });
    }
  });
};

const deleteImgHardDisk = async (req, res) => {
  const { id, type, picname } = req.body;
  const item = await Database[type].findById(id);
  if (item.picNames.length !== 0) {
    try {
      const index = item.picNames.indexOf(picname);
      item.picNames.splice(index, 1);

      await item.save();
      await fs.unlink(
        path.resolve(__dirname, "server", "public", "queryuploads", picname),
        (err) => {
          if (err) {
            console.log('deleteImgHardDisk1',err);
          }
        }
      );
      if (os.cpus()[0].model === "12th Gen Intel(R) Core(TM) i7-12700F") {
        await fs.unlink(
          path.resolve(
          __dirname,
          "quasar",
          "public",
          "queryuploads",
          picname
        ), (err) => {
          if (err) {
            console.log("deleteImgHardDisk2: No such File.");
          }
        });
      }

      return res.status(200).json({
        status: "success",
        msg: "照片已经删除",
      });
    } catch (error) {
      console.log('deleteImgHardDisk3', error);
      return res.status(401).json({
        status: "error",
        msg: error,
      });
    }
  } else {
    return res.status(401).json({
      status: "error",
      msg: "没有找到该图片",
    });
  }
};

const getImageMongodb = async (req, res) => {
  try {
    const { id, type } = req.query;
    // console.log('getImage_here', id, type);
    const item = await Database[type].findById(id);
    if (item.hasPic) {
      return res.status(200).json({
        status: "success",
        id: imgBuffer._id,
        buffer: imgBuffer.Buffer,
      });
    } else {
      return res.status(401).json({
        status: "error",
        msg: "没有图片信息",
      });
    }
  } catch (error) {
    console.log("getImage", error.message);
    return res.status(401).json({
      status: "error",
      msg: error.message,
    });
  }
};

const deleteImgMongodb = async (req, res) => {
  // console.log(req.body);
  try {
    const { id, type } = req.body;
    const updateRecord = {
      hasPic: false,
      Buffer: null,
    };
    const targetId = await Database[type].findOneAndUpdate(
      { _id: id },
      updateRecord
    );
    if (targetId) {
      return res.status(200).json({
        status: "success",
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
};

export {
  uploadImageMongodb,
  getImageMongodb,
  deleteImgMongodb,
  uploadHardDisk,
  deleteImgHardDisk,
  uploadtest,
};
